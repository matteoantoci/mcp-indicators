import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { smaTool } from './sma.js';
import { emaTool } from './ema.js';
import { rsiTool } from './rsi.js';
import { macdTool } from './macd.js';
import { bbandsTool } from './bbands.js';
import { stochTool } from './stoch.js';
import { atrTool } from './atr.js';
import { ichimokuTool } from './ichimoku.js';
import { volumeProfileTool } from './volumeProfile.js';

// Placeholder type for tool definition
type IndicatorToolDefinition = {
  name: string;
  description: string;
  // Expecting the raw shape object for Zod validation
  inputSchemaShape: z.ZodRawShape;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (input: any) => Promise<any>;
};

// Define the list of tools (will be populated later by importing from individual files)
const indicatorToolDefinitions: IndicatorToolDefinition[] = [
  smaTool,
  emaTool,
  rsiTool,
  macdTool,
  bbandsTool,
  stochTool,
  atrTool,
  ichimokuTool,
  volumeProfileTool,
];

/**
 * Registers all indicator tools with the MCP server.
 * @param server The McpServer instance.
 */
export const registerIndicatorTools = (server: McpServer): void => {
  indicatorToolDefinitions.forEach((toolDef) => {
    try {
      // Pass the raw shape to the inputSchema parameter, assuming SDK handles z.object()
      server.tool(toolDef.name, toolDef.description, toolDef.inputSchemaShape, async (input) => {
        const result = await toolDef.handler(input);
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      });
      console.log(`Registered indicator tool: ${toolDef.name}`);
    } catch (error) {
      console.error(`Failed to register tool ${toolDef.name}:`, error);
    }
  });
};
