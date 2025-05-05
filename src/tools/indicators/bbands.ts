import { z } from 'zod';
// Trying 'bollingerBands' as the export name from the indicatorts library
import { bollingerBands } from 'indicatorts';

// Define the input schema shape for the Bollinger Bands tool
const bbandsInputSchemaShape = {
  values: z
    .array(z.number())
    .min(1)
    .describe('Array of numbers (e.g., closing prices), ordered oldest to latest. Must contain at least one value.'),
  period: z.number().int().positive().describe('The time period for the SMA calculation (must be a positive integer).'),
  stdDev: z
    .number()
    .positive()
    .describe('The number of standard deviations to use for the upper and lower bands (must be positive).'),
};

type RawSchemaShape = typeof bbandsInputSchemaShape;
type Input = z.infer<z.ZodObject<RawSchemaShape>>;
type Output = {
  upper: number[];
  middle: number[];
  lower: number[];
};

// Define the handler function for the Bollinger Bands tool using an arrow function expression
const bbandsHandler = async (input: Input): Promise<Output> => {
  try {
    // Validate that period is not greater than the number of values
    if (input.period > input.values.length) {
      throw new Error(`Period (${input.period}) cannot be greater than the number of values (${input.values.length}).`);
    }

    // Assuming the indicatorts bbands function takes values and a config object
    const config = {
      period: input.period,
      stdDev: input.stdDev,
    };
    // Assuming the result is an object like { upper: number[], middle: number[], lower: number[] }
    const result = bollingerBands(input.values, config);

    // Return the calculated Bollinger Bands components
    return result;
  } catch (error: unknown) {
    console.error('Bollinger Bands calculation error:', error);
    const message =
      error instanceof Error ? error.message : 'An unknown error occurred during Bollinger Bands calculation.';
    // Re-throwing the error to be handled by the MCP server framework
    throw new Error(`Bollinger Bands calculation failed: ${message}`);
  }
};

// Define the tool definition object structure
type IndicatorToolDefinition = {
  name: string;
  description: string;
  inputSchemaShape: RawSchemaShape;
  handler: (input: Input) => Promise<Output>;
};

// Export the tool definition for Bollinger Bands
export const bbandsTool: IndicatorToolDefinition = {
  name: 'calculate_bbands',
  description:
    'Calculates Bollinger Bands (upper, middle, lower) for a given set of values, period, and standard deviation multiplier.',
  inputSchemaShape: bbandsInputSchemaShape,
  handler: bbandsHandler,
};
