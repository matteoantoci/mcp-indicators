import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerIndicatorTools } from './tools/indicators/index.js'; // Added /index.js

const main = async () => {
  const server = new McpServer({
    name: 'mcp-indicators',
    version: '1.0.0', // Added version
    description: 'MCP Server exposing technical analysis indicators and strategies from the indicatorts library.',
    // Add authentication if needed
  });

  // Register tools
  registerIndicatorTools(server);
  // TODO: Register strategy tools
  // TODO: Register utility tools

  console.log('Starting MCP Indicators Server...');
  // Use Stdio transport to connect
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log(`Server "mcp-indicators" connected via stdio.`); // Updated log message
};

main().catch((error) => {
  console.error('Failed to start MCP server:', error);
  process.exit(1);
});
