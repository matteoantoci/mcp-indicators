# MCP Indicators Server

A Model Context Protocol (MCP) server that exposes a suite of technical analysis indicators (SMA, EMA, RSI, MACD, Bollinger Bands, Stochastic Oscillator, ATR, Ichimoku Cloud) using the [indicatorts](https://www.npmjs.com/package/indicatorts) library. This server allows programmatic calculation of popular financial indicators via the MCP protocol.

## Prerequisites

- Node.js (v18 or later recommended)
- npm (comes with Node.js)
- (Optional) MCP-compatible client or runner (e.g., VSCode extension, CLI)

## Setup

1. **Clone the repository or ensure you are in the project directory.**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the server:**
   ```bash
   npm run build
   ```
   This will create a `build` directory with the compiled JavaScript code.

## Running the Server

- **Directly:**  
  ```bash
  node build/index.js
  ```
  or, if you have a start script:
  ```bash
  npm run start
  ```

- **Via MCP runner:**  
  Configure your MCP client to run the server using stdio transport.  
  Example MCP settings entry:
  ```json
  "mcp-indicators": {
    "transportType": "stdio",
    "command": "node",
    "args": [
      "/path/to/mcp-indicators/build/index.js"
    ]
    // ... other optional settings ...
  }
  ```

## Available Tools

The server exposes the following indicator tools via MCP:

### **calculate_sma**
- **Description:** Calculates the Simple Moving Average (SMA) for a given set of values and period.
- **Input:**
  - `values` (number[], required): Array of numbers (e.g., closing prices).
  - `period` (integer, required): The time period for the SMA calculation.
- **Output:**  
  - `{ sma: number[] }`

### **calculate_ema**
- **Description:** Calculates the Exponential Moving Average (EMA) for a given set of values and period.
- **Input:**
  - `values` (number[], required): Array of numbers.
  - `period` (integer, required): The time period for the EMA calculation.
- **Output:**  
  - `{ ema: number[] }`

### **calculate_rsi**
- **Description:** Calculates the Relative Strength Index (RSI) for a given set of values and period.
- **Input:**
  - `values` (number[], required): Array of numbers.
  - `period` (integer, required): The time period for the RSI calculation.
- **Output:**  
  - `{ rsi: number[] }`

### **calculate_macd**
- **Description:** Calculates the Moving Average Convergence Divergence (MACD) components (MACD line, signal line, histogram).
- **Input:**
  - `values` (number[], required): Array of numbers.
  - `fastPeriod` (integer, required): Fast EMA period.
  - `slowPeriod` (integer, required): Slow EMA period.
  - `signalPeriod` (integer, required): Signal line EMA period.
- **Output:**  
  - `{ macd: number[], signal: number[], histogram: number[] }`

### **calculate_bbands**
- **Description:** Calculates Bollinger Bands for a given set of values and period.
- **Input:**
  - `values` (number[], required): Array of numbers.
  - `period` (integer, required): The time period for the bands.
  - `stdDev` (number, required): Standard deviation multiplier.
- **Output:**  
  - `{ upper: number[], middle: number[], lower: number[] }`

### **calculate_stoch**
- **Description:** Calculates the Stochastic Oscillator for given high, low, and close values.
- **Input:**
  - `high` (number[], required): Array of high prices.
  - `low` (number[], required): Array of low prices.
  - `close` (number[], required): Array of close prices.
  - `kPeriod` (integer, required): %K period.
  - `dPeriod` (integer, required): %D period.
- **Output:**  
  - `{ k: number[], d: number[] }`

### **calculate_atr**
- **Description:** Calculates the Average True Range (ATR) for given high, low, and close values.
- **Input:**
  - `high` (number[], required): Array of high prices.
  - `low` (number[], required): Array of low prices.
  - `close` (number[], required): Array of close prices.
  - `period` (integer, required): ATR period.
- **Output:**  
  - `{ atr: number[] }`

### **ichimoku_cloud**
- **Description:** Calculates the Ichimoku Cloud indicator.
- **Input:**
  - `high` (number[], required): Array of high prices.
  - `low` (number[], required): Array of low prices.
  - `close` (number[], required): Array of close prices.
  - `conversionPeriod` (integer, default 9): Conversion line period.
  - `basePeriod` (integer, default 26): Base line period.
  - `spanPeriod` (integer, default 52): Lagging span 2 period.
  - `displacement` (integer, default 26): Displacement.
- **Output:**  
  - `{ ichimoku: object }` (structure depends on the library, typically includes arrays for the various Ichimoku lines)

## Extending

To add more indicators or strategies, implement a new tool in `src/tools/indicators/` and register it in `src/tools/indicators/index.ts`.
