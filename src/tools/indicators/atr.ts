import { z } from 'zod';
// Assuming 'atr' is the correct export name from the indicatorts library
import { atr } from 'indicatorts';

// Define the input schema shape for the ATR tool
const atrInputSchemaShape = {
  high: z.array(z.number()).min(1).describe('Array of high prices. Must contain at least one value.'),
  low: z.array(z.number()).min(1).describe('Array of low prices. Must contain at least one value.'),
  close: z.array(z.number()).min(1).describe('Array of closing prices. Must contain at least one value.'),
  period: z.number().int().positive().describe('The time period for the ATR calculation (must be a positive integer).'),
};

// Define the handler function for the ATR tool using an arrow function expression
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const atrHandler = async (input: z.infer<z.ZodObject<typeof atrInputSchemaShape>>): Promise<any> => {
  try {
    // Basic validation: ensure all input arrays have the same length
    if (input.high.length !== input.low.length || input.high.length !== input.close.length) {
      throw new Error('Input arrays (high, low, close) must have the same length.');
    }
    // Validate that period is not greater than the number of values
    // ATR calculation needs at least 'period' data points to start
    if (input.period > input.high.length) {
      throw new Error(`Period (${input.period}) cannot be greater than the number of values (${input.high.length}).`);
    }

    // Assuming the indicatorts atr function takes high, low, close arrays
    // and a config object with the period.
    const config = {
      period: input.period,
    };

    // Assuming the result is an array of numbers
    // Correcting signature based on TS error: atr(high, low, close, config)
    const result = atr(input.high, input.low, input.close, config);

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
  inputSchemaShape: z.ZodRawShape;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (input: any) => Promise<any>;
};

// Export the tool definition for ATR
export const atrTool: IndicatorToolDefinition = {
  name: 'calculate_atr',
  description: 'Calculates the Average True Range (ATR) for given high, low, and close prices and period.',
  inputSchemaShape: atrInputSchemaShape,
  handler: atrHandler,
};
