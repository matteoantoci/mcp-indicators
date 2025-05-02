import { z } from 'zod';
// Assuming 'stoch' is the correct export name from the indicatorts library
import { stoch } from 'indicatorts';

// Define the input schema shape for the Stochastic Oscillator tool
const stochInputSchemaShape = {
  high: z.array(z.number()).min(1).describe('Array of high prices. Must contain at least one value.'),
  low: z.array(z.number()).min(1).describe('Array of low prices. Must contain at least one value.'),
  close: z.array(z.number()).min(1).describe('Array of closing prices. Must contain at least one value.'),
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
    // Basic validation: ensure all input arrays have the same length
    if (input.high.length !== input.low.length || input.high.length !== input.close.length) {
      throw new Error('Input arrays (high, low, close) must have the same length.');
    }
    // Validate that period is not greater than the number of values
    if (input.period > input.high.length) {
      throw new Error(`Period (${input.period}) cannot be greater than the number of values (${input.high.length}).`);
    }
    // Validate that signalPeriod is not greater than the number of values (after initial %K calculation)
    if (input.signalPeriod > input.high.length) {
      throw new Error(
        `Signal Period (${input.signalPeriod}) cannot be greater than the number of values (${input.high.length}).`
      );
    }

    // Assuming the indicatorts stoch function takes high, low, close arrays
    // and a config object.
    const config = {
      kPeriod: input.period,
      dPeriod: input.signalPeriod,
      slowingPeriod: input.kSmoothingPeriod,
    };

    // Assuming the result is an object like { k: number[], d: number[] }
    const result = stoch(input.high, input.low, input.close, config);

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
