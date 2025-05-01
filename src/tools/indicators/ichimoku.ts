import { z } from 'zod';
import { ichimokuCloud } from 'indicatorts'; // Assuming function name

// Define the Zod schema for Ichimoku Cloud input
const ichimokuInputSchemaShape = {
  high: z.array(z.number()).describe('Array of high prices'),
  low: z.array(z.number()).describe('Array of low prices'),
  close: z.array(z.number()).describe('Array of close prices'),
  conversionPeriod: z.number().int().positive().default(9).describe('Conversion line period'),
  basePeriod: z.number().int().positive().default(26).describe('Base line period'),
  spanPeriod: z.number().int().positive().default(52).describe('Lagging span 2 period'),
  displacement: z.number().int().positive().default(26).describe('Displacement'),
};

// Define the Zod schema for the full input object
const ichimokuInputSchema = z.object(ichimokuInputSchemaShape);

// Type for the validated input
type IchimokuInput = z.infer<typeof ichimokuInputSchema>;

// Handler function for the Ichimoku Cloud tool
const ichimokuHandler = async (input: IchimokuInput): Promise<{ ichimoku: unknown }> => {
  try {
    // Validate input using the Zod schema
    const validatedInput = ichimokuInputSchema.parse(input);

    // Prepare configuration using the correct IchimokuCloudConfig interface properties
    const config = {
      short: validatedInput.conversionPeriod, // Map conversionPeriod to short
      medium: validatedInput.basePeriod, // Map basePeriod to medium
      long: validatedInput.spanPeriod, // Map spanPeriod to long
      close: validatedInput.displacement, // Map displacement to close (as per interface)
    };

    // Call the indicatorts library function (expecting 4 args: high, low, close, config)
    const result = ichimokuCloud(validatedInput.high, validatedInput.low, validatedInput.close, config);

    // Return the result
    return { ichimoku: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Input validation failed:', error.errors);
      throw new Error(`Input validation failed: ${error.errors.map((e) => e.message).join(', ')}`);
    }
    console.error('Error calculating Ichimoku Cloud:', error);
    throw new Error('Failed to calculate Ichimoku Cloud');
  }
};

// Define the MCP tool
export const ichimokuTool = {
  name: 'ichimoku_cloud',
  description: 'Calculates the Ichimoku Cloud indicator',
  inputSchemaShape: ichimokuInputSchemaShape,
  handler: ichimokuHandler,
};
