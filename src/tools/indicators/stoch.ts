import { z } from 'zod';
// Assuming 'stoch' is the correct export name from the indicatorts library
import { stoch } from 'indicatorts';

// Define the input schema shape for the Stochastic Oscillator tool
const stochInputSchemaShape = {
  high: z.array(z.number()).min(1).describe('Array of high prices, ordered latest to oldest. Must contain at least one value.'),
  low: z.array(z.number()).min(1).describe('Array of low prices, ordered latest to oldest. Must contain at least one value.'),
  close: z.array(z.number()).min(1).describe('Array of closing prices, ordered latest to oldest. Must contain at least one value.'),
  period: z.number().int().positive().describe('The time period for the %K calculation (must be a positive integer).'),
  signalPeriod: z
    .number()
    .int()
    .positive()
    .describe('The time period for the %D (signal line) calculation (must be a positive integer).'),
  kSmoothingPeriod: z
    .number()
    .int()
    .positive()
    .optional()
    .default(3)
    .describe('The smoothing period for %K (often 3, optional).'),
};

type RawSchemaShape = typeof stochInputSchemaShape;
type Input = z.infer<z.ZodObject<RawSchemaShape>>;
type Output = {
  k: number[]; // %K line
  d: number[]; // %D line
};

// Define the handler function for the Stochastic Oscillator tool using an arrow function expression
const stochHandler = async (input: Input): Promise<Output> => {
  try {
    let { high, low, close, period, signalPeriod, kSmoothingPeriod } = input;

    // Determine the shortest length and truncate arrays if necessary
    const minLength = Math.min(high.length, low.length, close.length);

    if (minLength < high.length || minLength < low.length || minLength < close.length) {
      console.warn(`Stochastic Oscillator: Input arrays have different lengths. Truncating to the shortest length: ${minLength}`);
      high = high.slice(0, minLength);
      low = low.slice(0, minLength);
      close = close.slice(0, minLength);
    }

    // Validate that period is not greater than the number of values after potential truncation
    if (period > high.length) { // Use high.length which is now minLength if truncated
      throw new Error(`Period (${period}) cannot be greater than the number of values (${high.length}).`);
    }
    // Validate that signalPeriod is not greater than the number of values (after initial %K calculation)
    if (signalPeriod > high.length) { // Use high.length which is now minLength if truncated
      throw new Error(
        `Signal Period (${signalPeriod}) cannot be greater than the number of values (${high.length}).`
      );
    }

    // Assuming the indicatorts stoch function takes high, low, close arrays
    // and a config object.
    const config = {
      kPeriod: period,
      dPeriod: signalPeriod,
      slowingPeriod: kSmoothingPeriod,
    };

    // Assuming the result is an object like { k: number[], d: number[] }
    const result = stoch(high, low, close, config);

    // Return the calculated Stochastic Oscillator components (%K and %D)
    return result;
  } catch (error: unknown) {
    console.error('Stochastic Oscillator calculation error:', error);
    const message =
      error instanceof Error ? error.message : 'An unknown error occurred during Stochastic Oscillator calculation.';
    // Re-throwing the error to be handled by the MCP server framework
    throw new Error(`Stochastic Oscillator calculation failed: ${message}`);
  }
};

// Define the tool definition object structure
type IndicatorToolDefinition = {
  name: string;
  description: string;
  inputSchemaShape: RawSchemaShape;
  handler: (input: Input) => Promise<Output>;
};

// Export the tool definition for Stochastic Oscillator
export const stochTool: IndicatorToolDefinition = {
  name: 'calculate_stoch',
  description:
    'Calculates the Stochastic Oscillator (%K and %D lines) for given high, low, and close prices, period, signal period, and optional K smoothing period.',
  inputSchemaShape: stochInputSchemaShape,
  handler: stochHandler,
};
