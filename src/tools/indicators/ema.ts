import { z } from 'zod';
// Assuming 'ema' is the correct export name from the indicatorts library
import { ema } from 'indicatorts';

// Define the input schema shape for the EMA tool
const emaInputSchemaShape = {
  values: z
    .array(z.number())
    .min(1)
    .describe('Array of numbers (e.g., closing prices). Must contain at least one value.'),
  period: z.number().int().positive().describe('The time period for the EMA calculation (must be a positive integer).'),
};

// Define the handler function for the EMA tool using an arrow function expression
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const emaHandler = async (input: z.infer<z.ZodObject<typeof emaInputSchemaShape>>): Promise<any> => {
  try {
    // Validate that period is not greater than the number of values
    if (input.period > input.values.length) {
      throw new Error(`Period (${input.period}) cannot be greater than the number of values (${input.values.length}).`);
    }

    // Assuming the indicatorts ema function takes values and a config object
    // with the period, and returns an array of numbers.
    const config = { period: input.period };
    const result = ema(input.values, config);

    // The result array might be shorter than the input array due to the period.
    // Return the calculated EMA values.
    return { ema: result };
  } catch (error: unknown) {
    console.error('EMA calculation error:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred during EMA calculation.';
    // Re-throwing the error to be handled by the MCP server framework
    throw new Error(`EMA calculation failed: ${message}`);
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

// Export the tool definition for EMA
export const emaTool: IndicatorToolDefinition = {
  name: 'calculate_ema',
  description: 'Calculates the Exponential Moving Average (EMA) for a given set of values and period.',
  inputSchemaShape: emaInputSchemaShape,
  handler: emaHandler,
};
