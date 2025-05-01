import { z } from 'zod';
// Assuming 'rsi' is the correct export name from the indicatorts library
import { rsi } from 'indicatorts';

// Define the input schema shape for the RSI tool
const rsiInputSchemaShape = {
  values: z
    .array(z.number())
    .min(1)
    .describe('Array of numbers (e.g., closing prices). Must contain at least one value.'),
  period: z.number().int().positive().describe('The time period for the RSI calculation (must be a positive integer).'),
};

// Define the handler function for the RSI tool using an arrow function expression
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rsiHandler = async (input: z.infer<z.ZodObject<typeof rsiInputSchemaShape>>): Promise<any> => {
  try {
    // Validate that period is not greater than the number of values
    // RSI typically needs period + 1 values to calculate the first point
    if (input.period + 1 > input.values.length) {
      throw new Error(
        `RSI requires at least period + 1 values. Period: ${input.period}, Values provided: ${input.values.length}.`
      );
    }

    // Assuming the indicatorts rsi function takes values and a config object
    // with the period, and returns an array of numbers.
    const config = { period: input.period };
    const result = rsi(input.values, config);

    // The result array might be shorter than the input array.
    // Return the calculated RSI values.
    return { rsi: result };
  } catch (error: unknown) {
    console.error('RSI calculation error:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred during RSI calculation.';
    // Re-throwing the error to be handled by the MCP server framework
    throw new Error(`RSI calculation failed: ${message}`);
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

// Export the tool definition for RSI
export const rsiTool: IndicatorToolDefinition = {
  name: 'calculate_rsi',
  description: 'Calculates the Relative Strength Index (RSI) for a given set of values and period.',
  inputSchemaShape: rsiInputSchemaShape,
  handler: rsiHandler,
};
