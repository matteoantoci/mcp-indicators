import BigNumber from 'bignumber.js';
import { z } from 'zod';

export interface VolumeProfileBin {
  priceLow: number;
  priceHigh: number;
  priceMid: number;
  volume: number;
  volumePercent: number;
}

export interface VolumeProfileResult {
  priceMin: number;
  priceMax: number;
  binWidth: number;
  bins: VolumeProfileBin[];
  pointOfControl: number | null;
  valueAreaLow?: number;
  valueAreaHigh?: number;
}

export interface CalculateVolumeProfileInput {
  high: number[];
  low: number[];
  volume: number[];
  numBins?: number;
}

export const volumeProfileTool = {
  name: 'calculate_volume_profile',
  description: 'Calculates the Volume Profile indicator and returns volume distribution by price bins, Point of Control (POC), and Value Area High/Low (VAH/VAL)',
  inputSchemaShape: {
  high: z.array(z.number()).describe('Array of high prices, ordered oldest to latest'),
  low: z.array(z.number()).describe('Array of low prices, ordered oldest to latest'),
  volume: z.array(z.number()).describe('Array of volume values, ordered oldest to latest'),
    numBins: z.number().optional().describe('Optional number of price bins (default 10)'),
  },
  handler: async (input: { high: number[]; low: number[]; volume: number[]; numBins?: number }) => {
    let { high, low, volume, numBins = 10 } = input; // Use let for potential reassignment

    // Determine the shortest length and truncate arrays if necessary
    const minLength = Math.min(high.length, low.length, volume.length);

    if (minLength < high.length || minLength < low.length || minLength < volume.length) {
      console.warn(`VolumeProfile: Input arrays have different lengths. Truncating to the shortest length: ${minLength}`);
      high = high.slice(0, minLength);
      low = low.slice(0, minLength);
      volume = volume.slice(0, minLength);
    }

    // Check length after potential truncation
    if (high.length < 20) { // Use high.length which is now minLength if truncated
      throw new Error(`Not enough data for volume profile analysis after aligning array lengths (need 20, got ${high.length})`);
    }
    // Removed the check for equal lengths as arrays are now truncated or were already equal

    const bigLow = low.map((v) => new BigNumber(v)); // Use the potentially truncated 'low'
    const bigHigh = high.map((v) => new BigNumber(v)); // Use the potentially truncated 'high'
    const bigVolume = volume.map((v) => new BigNumber(v)); // Use the potentially truncated 'volume'

    const priceMin = BigNumber.minimum(...bigLow).toNumber();
    const priceMax = BigNumber.maximum(...bigHigh).toNumber();
    const binWidth = new BigNumber(priceMax).minus(priceMin).dividedBy(numBins);

    const totalVolume = bigVolume.reduce((acc, val) => acc.plus(val), new BigNumber(0));

    const bins = Array.from({ length: numBins }, (_, i) => {
      const binLow = new BigNumber(priceMin).plus(binWidth.times(i));
      const binHigh = binLow.plus(binWidth);
      const binMid = binLow.plus(binHigh).dividedBy(2);

      const volumeInBin = bigVolume.reduce((acc, vol, idx) => {
        if (bigLow[idx].lte(binHigh) && bigHigh[idx].gte(binLow)) {
          return acc.plus(vol);
        }
        return acc;
      }, new BigNumber(0));

      const volumePercent = totalVolume.gt(0) ? volumeInBin.dividedBy(totalVolume).times(100) : new BigNumber(0);

      return {
        priceLow: binLow.toNumber(),
        priceHigh: binHigh.toNumber(),
        priceMid: binMid.toNumber(),
        volume: Math.round(volumeInBin.toNumber()),
        volumePercent: volumePercent.toNumber(),
      };
    });

    // Point of Control (POC) - bin with highest volume
    const pocBin = bins.reduce((prev, current) => (current.volume > prev.volume ? current : prev), bins[0]);
    const pointOfControl = pocBin ? pocBin.priceMid : null;

    // Value Area (70% of volume)
    const sortedBins = [...bins].sort((a, b) => b.volume - a.volume);
    let cumulativeVolume = 0;
    const valueAreaBins: VolumeProfileBin[] = [];
    for (const bin of sortedBins) {
      valueAreaBins.push(bin);
      cumulativeVolume += bin.volumePercent;
      if (cumulativeVolume >= 70) {
        break;
      }
    }

    const valueAreaLow = valueAreaBins.length > 0 ? Math.min(...valueAreaBins.map((b) => b.priceLow)) : undefined;
    const valueAreaHigh = valueAreaBins.length > 0 ? Math.max(...valueAreaBins.map((b) => b.priceHigh)) : undefined;

    return {
      priceMin,
      priceMax,
      binWidth: binWidth.toNumber(),
      bins,
      pointOfControl,
      valueAreaLow,
      valueAreaHigh,
    };
  },
};
