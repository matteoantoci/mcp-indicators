import { z } from 'zod';
// Assuming 'sma' is the correct export name from the indicatorts library
import { sma } from 'indicatorts';

// Define the input schema shape for the SMA tool
const smaInputSchemaShape = {
  values: z
    .array(z.number())
    .min(1)
    .describe('Array of numbers (e.g., closing prices). Must contain at least one value.'),
  period: z.number().int().positive().describe('The time period for the SMA calculation (must be a positive integer).'),
};

type RawSchemaShape = typeof smaInputSchemaShape;
type Input = z.infer<z.ZodObject<RawSchemaShape>>;
type Output = { sma: number[] };

// Define the handler function for the SMA tool using an arrow function expression
const smaHandler = async (input: Input): Promise<Output> => {
  try {
    // Validate that period is not greater than the number of values
    if (input.period > input.values.length) {
      throw new Error(`Period (${input.period}) cannot be greater than the number of values (${input.values.length}).`);
    }

    // Assuming the indicatorts sma function takes values and a config object
    // with the period, and returns an array of numbers.
    const config = { period: input.period };
    const result = sma(input.values, config);

    // The result array might be shorter than the input array due to the period.
    // Return the calculated SMA values.
    return { sma: result };
  } catch (error: unknown) {
    console.error('SMA calculation error:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred during SMA calculation.';
    // Re-throwing the error to be handled by the MCP server framework
    throw new Error(`SMA calculation failed: ${message}`);
  }
};

// Define the tool definition object structure (matching the one in index.ts)
type IndicatorToolDefinition = {
  name: string;
  description: string;
  inputSchemaShape: RawSchemaShape;
  handler: (input: Input) => Promise<Output>;
};

// Export the tool definition for SMA
export const smaTool: IndicatorToolDefinition = {
  name: 'calculate_sma',
  description: 'Calculates the Simple Moving Average (SMA) for a given set of values and period.',
  inputSchemaShape: smaInputSchemaShape,
  handler: smaHandler,
};
