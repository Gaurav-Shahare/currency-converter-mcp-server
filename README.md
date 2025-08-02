# Currency Converter MCP Server

This is a simple MCP server that provides tools for currency conversion.

## Installation

To install the dependencies, run:

```bash
npm install
```

## Building the Server

To build the server, run:

```bash
npm run build
```

This will compile the TypeScript files and output the JavaScript files in the `build` directory.

## Running the Server

To run the server, use the following command:

```bash
node build/index.js
```

The server will start and listen for requests on standard input/output.

## MCP Configuration

Before running the server with a client, make sure you have built the project using `npm run build`.

Here is an example MCP configuration for a host like VScode to connect to this server. The `args` path should point to the compiled `index.js` file in the `build` directory.

```json
"my-mcp-server-e78fecda": {
  "type": "stdio",
  "command": "node",
  "args": [
    "<PATH_TO_INDEX_JS>/build/index.js"
  ]
}
```

## Available Tools

### `get-currencies-fullname`

Look up the full name of a currency based on its code.

**Input:**

- `currencyCode` (string): Three-letter currency code (e.g., USD, EUR).

**Output:**

The full name of the currency.

### `get-currency-conversion`

Convert an amount from one currency to another.

**Input:**

- `value` (number): The amount to convert.
- `sourcecurrencyCode` (string): The source currency code.
- `targetcurrencyCode` (string): The target currency code.

**Output:**

The converted amount.

## Credits

The currency conversion APIs are provided by the [Currency API](https.github.com/fawazahmed0/exchange-api) project.
