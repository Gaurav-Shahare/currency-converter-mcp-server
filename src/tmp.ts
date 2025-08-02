import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const CURRENY_CONVERTER_API =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";
const AVAILABLE_CURRENCIES_API =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json";

type CurrencyDataRecord = Record<string, string>;
interface ConversionRates {
  [key: string]: number;
}
interface CurrencyApiResponse {
  date: string;
  [baseCurrency: string]: ConversionRates | string;
}
const AVAILABLE_CURRENCIES_RECORD: CurrencyDataRecord = {};

// Create server instance
const server = new McpServer({
  name: "currency-converter",
  version: "1.0.0",
});

async function fetchData<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw new Error(`Failed to fetch data from ${url}`);
  }
}

server.tool(
  "get-currencies-fullname",
  "Look up the full name of a currency based on its code",
  {
    currencyCode: z
      .string()
      .describe("Three-letter currency code (e.g. USD, EUR, GALA)"),
  },
  async ({ currencyCode }) => {
    return {
      content: [
        {
          type: "text",
          text: `The full name for the currency code "${currencyCode.toUpperCase()}" is: ${currencyCode.toUpperCase()}`,
        },
      ],
    };
  }
);

server.tool(
  "get-currency-conversion",
  "Convert an amount from one currency to another",
  {
    value: z.number().describe("Amount to convert"),
    sourcecurrencyCode: z
      .string()
      .describe("Source currency code (e.g. USD, EUR, GALA)"),
    targetcurrencyCode: z
      .string()
      .describe("Target currency code (e.g. USD, EUR, GALA)"),
  },
  async ({ value, sourcecurrencyCode, targetcurrencyCode }) => {
    // if (
    //   !AVAILABLE_CURRENCIES_RECORD[targetcurrencyCode] &&
    //   !AVAILABLE_CURRENCIES_RECORD[sourcecurrencyCode]
    // ) {
    //   return {
    //     content: [
    //       {
    //         type: "text",
    //         text: `Unknown currency code(s): ${targetcurrencyCode}, ${sourcecurrencyCode}`,
    //       },
    //     ],
    //   };
    // }

    const url = `${CURRENY_CONVERTER_API}/${sourcecurrencyCode.toLowerCase()}.json`;

    try {
      const response: CurrencyApiResponse =
        await fetchData<CurrencyApiResponse>(url);
      const conversionRates = response[
        sourcecurrencyCode.toLowerCase()
      ] as ConversionRates;
      const rate = conversionRates[targetcurrencyCode.toLowerCase()];
      return {
        content: [
          {
            type: "text",
            text: `Conversion form ${sourcecurrencyCode} to ${targetcurrencyCode} is ${
              rate * value
            }.`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to fetch conversion rates for ${sourcecurrencyCode} ${error}.`,
          },
        ],
      };
    }
  }
);

// Start the server
async function main() {
  try {
    const response: CurrencyDataRecord = await fetchData<CurrencyDataRecord>(
      AVAILABLE_CURRENCIES_API
    );
    Object.entries(response).forEach(([key, value]) => {
      AVAILABLE_CURRENCIES_RECORD[key] = value;
    });
  } catch (error) {
    console.error("Error fetching available currencies:", error);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Currency-converter MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
