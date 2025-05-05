# System Patterns

This document outlines the system architecture, key technical decisions, design patterns in use, and component relationships within the mcp-indicators project.

## Architecture:
The project is structured as an MCP server, exposing technical indicator calculations as tools. It follows a modular design, with each indicator implemented in a separate file.

## Key Technical Decisions:
- Use TypeScript for type safety and code maintainability.
- Implement indicator calculations using well-established algorithms.
- Utilize the MCP framework for tool exposure and communication.

## Design Patterns:
- **Module Pattern:** Each indicator is encapsulated within its own module.
- **Dependency Injection:** (To be implemented) Inject data fetching dependencies to allow for flexible data sources.

## Component Relationships:
- **MCP Server:** The main component that hosts and exposes the indicator tools.
- **Indicator Modules:** Individual modules for each technical indicator, containing the calculation logic.
- **Data Fetching (Planned):** Components responsible for fetching financial data from external sources (likely other MCP servers).
- **Tool Definitions:** Metadata defining the input and output schemas for each indicator tool.
