import { z } from 'zod';
import { ichimokuCloud } from 'indicatorts'; // Assuming function name

// Define the input schema shape for Ichimoku Cloud
const ichimokuInputSchemaShape = {
  high: z.array(z.number()).describe('Array of high prices, ordered oldest to latest'),
  low: z.array(z.number()).describe('Array of low prices, ordered oldest to latest'),
  close: z.array(z.number()).describe('Array of close prices, ordered oldest to latest'),
  conversionPeriod: z.number().int().positive().default(9).describe('Conversion line period'),
  basePeriod: z.number().int().positive().default(26).describe('Base line period'),
  spanPeriod: z.number().int().positive().default(52).describe('Lagging span 2 period'),
  displacement: z.number().int().positive().default(26).describe('Displacement'),
};

type RawSchemaShape = typeof ichimokuInputSchemaShape;
type Input = z.infer<z.ZodObject<RawSchemaShape>>;
type Output = ReturnType<typeof ichimokuCloud>;

// Handler function for the Ichimoku Cloud tool
const ichimokuHandler = async (input: Input): Promise<Output> => {
  try {
    // Basic validation
    if (input.high.length !== input.low.length || input.high.length !== input.close.length) {
      throw new Error('Input arrays (high, low, close) must have the same length.');
    }
    const longestPeriod = Math.max(input.conversionPeriod, input.basePeriod, input.spanPeriod);
    if (longestPeriod > input.high.length) {
      throw new Error(
        `Longest period (${longestPeriod}) cannot be greater than the number of values (${input.high.length}).`
      );
    }

    // Prepare configuration
    const config = {
      short: input.conversionPeriod,
      medium: input.basePeriod,
      long: input.spanPeriod,
      displacement: input.displacement,
    };

    // Call the indicatorts library function
    const result = ichimokuCloud(input.high, input.low, input.close, config);

    // Return the result
    return result;
  } catch (error: unknown) {
    console.error('Ichimoku Cloud calculation error:', error);
    const message =
      error instanceof Error ? error.message : 'An unknown error occurred during Ichimoku Cloud calculation.';
    throw new Error(`Ichimoku Cloud calculation failed: ${message}`);
  }
};

// Define the tool definition object structure
type IndicatorToolDefinition = {
  name: string;
  description: string;
  inputSchemaShape: RawSchemaShape;
  handler: (input: Input) => Promise<Output>;
};

// Export the tool definition for Ichimoku Cloud
export const ichimokuTool: IndicatorToolDefinition = {
  name: 'ichimoku_cloud',
  description: 'Calculates the Ichimoku Cloud indicator',
  inputSchemaShape: ichimokuInputSchemaShape,
  handler: ichimokuHandler,
};
