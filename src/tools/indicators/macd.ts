import { z } from 'zod';
// Assuming 'macd' is the correct export name from the indicatorts library
import { macd } from 'indicatorts';

// Define the input schema shape for the MACD tool
const macdInputSchemaShape = {
  values: z
    .array(z.number())
    .min(1)
    .describe('Array of numbers (e.g., closing prices). Must contain at least one value.'),
  fastPeriod: z.number().int().positive().describe('The time period for the fast EMA (must be a positive integer).'),
  slowPeriod: z.number().int().positive().describe('The time period for the slow EMA (must be a positive integer).'),
  signalPeriod: z
    .number()
    .int()
    .positive()
    .describe('The time period for the signal line EMA (must be a positive integer).'),
};

// Define the handler function for the MACD tool using an arrow function expression
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const macdHandler = async (input: z.infer<z.ZodObject<typeof macdInputSchemaShape>>): Promise<any> => {
  try {
    // Basic validation
    if (input.fastPeriod >= input.slowPeriod) {
      throw new Error(`fastPeriod (${input.fastPeriod}) must be less than slowPeriod (${input.slowPeriod}).`);
    }
    // MACD calculation typically requires at least slowPeriod + signalPeriod - 1 values
    const requiredLength = input.slowPeriod + input.signalPeriod - 1;
    if (input.values.length < requiredLength) {
      throw new Error(
        `MACD requires at least slowPeriod + signalPeriod - 1 values (${requiredLength}). Provided: ${input.values.length}.`
      );
    }

    // Assuming the indicatorts macd function takes values and a config object
    // Trying simpler property names based on the TS error
    const config = {
      fast: input.fastPeriod,
      slow: input.slowPeriod,
      signal: input.signalPeriod,
    };
    // Assuming the result is an object like { macd: number[], signal: number[], histogram: number[] }
    const result = macd(input.values, config);

    // Return the calculated MACD components
    return result; // Directly return the object from the library if it matches the expected structure
  } catch (error: unknown) {
    console.error('MACD calculation error:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred during MACD calculation.';
    // Re-throwing the error to be handled by the MCP server framework
    throw new Error(`MACD calculation failed: ${message}`);
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

// Export the tool definition for MACD
export const macdTool: IndicatorToolDefinition = {
  name: 'calculate_macd',
  description:
    'Calculates the Moving Average Convergence Divergence (MACD) components (MACD line, signal line, histogram).',
  inputSchemaShape: macdInputSchemaShape,
  handler: macdHandler,
};
