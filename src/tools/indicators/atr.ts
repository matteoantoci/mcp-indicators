import { z } from 'zod';
// Assuming 'atr' is the correct export name from the indicatorts library
import { atr } from 'indicatorts';

// Define the input schema shape for the ATR tool
const atrInputSchemaShape = {
  high: z.array(z.number()).min(1).describe('Array of high prices, ordered oldest to latest. Must contain at least one value.'),
  low: z.array(z.number()).min(1).describe('Array of low prices, ordered oldest to latest. Must contain at least one value.'),
  close: z.array(z.number()).min(1).describe('Array of closing prices, ordered oldest to latest. Must contain at least one value.'),
  period: z.number().int().positive().describe('The time period for the ATR calculation (must be a positive integer).'),
};

type RawSchemaShape = typeof atrInputSchemaShape;
type Input = z.infer<z.ZodObject<RawSchemaShape>>;
type Output = { atr: ReturnType<typeof atr> };

// Define the handler function for the ATR tool using an arrow function expression
const atrHandler = async (input: Input): Promise<Output> => {
  try {
    let { high, low, close, period } = input;

    // Determine the shortest length and truncate arrays if necessary
    const minLength = Math.min(high.length, low.length, close.length);

    if (minLength < high.length || minLength < low.length || minLength < close.length) {
      console.warn(`ATR: Input arrays have different lengths. Truncating to the shortest length: ${minLength}`);
      high = high.slice(0, minLength);
      low = low.slice(0, minLength);
      close = close.slice(0, minLength);
    }

    // Validate that period is not greater than the number of values after potential truncation
    // ATR calculation needs at least 'period' data points to start
    if (period > high.length) { // Use high.length which is now minLength if truncated
      throw new Error(`Period (${period}) cannot be greater than the number of values (${high.length}).`);
    }

    // Assuming the indicatorts atr function takes high, low, close arrays
    // and a config object with the period.
    const config = {
      period: period,
    };

    // Assuming the result is of type ReturnType<typeof atr>
    const result = atr(high, low, close, config);

    // Return the calculated ATR values
    return { atr: result };
  } catch (error: unknown) {
    console.error('ATR calculation error:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred during ATR calculation.';
    // Re-throwing the error to be handled by the MCP server framework
    throw new Error(`ATR calculation failed: ${message}`);
  }
};

// Define the tool definition object structure
type IndicatorToolDefinition = {
  name: string;
  description: string;
  inputSchemaShape: RawSchemaShape;
  handler: (input: Input) => Promise<Output>;
};

// Export the tool definition for ATR
export const atrTool: IndicatorToolDefinition = {
  name: 'calculate_atr',
  description: 'Calculates the Average True Range (ATR) for given high, low, and close prices and period.',
  inputSchemaShape: atrInputSchemaShape,
  handler: atrHandler,
};
