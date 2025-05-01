import { z } from 'zod';
// Trying 'bollingerBands' as the export name from the indicatorts library
import { bollingerBands } from 'indicatorts';

// Define the input schema shape for the Bollinger Bands tool
const bbandsInputSchemaShape = {
  values: z
    .array(z.number())
    .min(1)
    .describe('Array of numbers (e.g., closing prices). Must contain at least one value.'),
  period: z.number().int().positive().describe('The time period for the SMA calculation (must be a positive integer).'),
  stdDev: z
    .number()
    .positive()
    .describe('The number of standard deviations to use for the upper and lower bands (must be positive).'),
};

// Define the handler function for the Bollinger Bands tool using an arrow function expression
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const bbandsHandler = async (input: z.infer<z.ZodObject<typeof bbandsInputSchemaShape>>): Promise<any> => {
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
    const result = bollingerBands(input.values, config); // Changed function call

    // Return the calculated Bollinger Bands components
    return result; // Directly return the object from the library
  } catch (error: unknown) {
    console.error('Bollinger Bands calculation error:', error);
    const message =
      error instanceof Error ? error.message : 'An unknown error occurred during Bollinger Bands calculation.';
    // Re-throwing the error to be handled by the MCP server framework
    throw new Error(`Bollinger Bands calculation failed: ${message}`);
  }
};

// Define the tool definition object structure (matching the one in index.ts)
type IndicatorToolDefinition = {
  name: string;
  description: string;
  inputSchemaShape: z.ZodRawShape;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (input: any) => Promise<any>;
};

// Export the tool definition for Bollinger Bands
export const bbandsTool: IndicatorToolDefinition = {
  name: 'calculate_bbands',
  description:
    'Calculates Bollinger Bands (upper, middle, lower) for a given set of values, period, and standard deviation multiplier.',
  inputSchemaShape: bbandsInputSchemaShape,
  handler: bbandsHandler,
};
