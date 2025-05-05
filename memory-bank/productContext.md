# Product Context

This document describes the purpose of the mcp-indicators project, the problems it solves, how it should work, and the user experience goals.

## Purpose:
The primary purpose of this project is to provide a set of reliable and easy-to-use technical indicators for financial analysis within the Model Context Protocol (MCP) framework.

## Problems Solved:
- Provides a standardized way to calculate common technical indicators.
- Enables integration with various financial data sources through the MCP.
- Simplifies the process of incorporating technical analysis into trading strategies or financial applications.

## How it Should Work:
The project should expose each technical indicator as an individual MCP tool. Users should be able to call these tools with relevant financial data (e.g., price arrays, periods) and receive the calculated indicator values as output. The tools should handle data validation and provide meaningful error messages.

## User Experience Goals:
- Users should find it easy to understand and use the provided MCP tools.
- The tools should be performant and return results quickly.
- Documentation for each tool should be clear and comprehensive.
- Integration with other MCP servers for data fetching should be seamless.
