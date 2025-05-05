# Technical Context

This document details the technologies used, the development setup, technical constraints, and dependencies for the mcp-indicators project.

## Technologies Used:
- **TypeScript:** The primary language for development.
- **Node.js:** The runtime environment for the MCP server.
- **MCP Framework:** The framework used to build and expose the tools.
- **npm/yarn:** Package managers for dependency management.

## Development Setup:
- The project is developed in a standard Node.js environment.
- Dependencies are managed via `package.json`.
- Building and testing are handled via scripts defined in `package.json`.

## Technical Constraints:
- Indicator calculations must be performed efficiently to handle potentially large datasets.
- The project must adhere to the MCP specification for tool and resource exposure.
- External API rate limits for data fetching (when implemented) need to be considered.

## Dependencies:
- **@modelcontextprotocol/server:** The core MCP server library.
- **Technical Indicator Libraries:** (To be determined/implemented) Libraries for performing the actual indicator calculations.
