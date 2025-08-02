import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getConversionRate } from "./api.js";

export function registerTools(
  server: McpServer,
  availableCurrencies: Record<string, string>
) {
  server.tool(
    "get-currencies-fullname",
    "Look up the full name of a currency based on its code",
    {
      currencyCode: z
        .string()
        .describe("Three-letter currency code (e.g. USD, EUR, GALA)"),
    },
    async ({ currencyCode }) => {
      const code = currencyCode.toLowerCase();
      const fullName = availableCurrencies[code];
      if (!fullName) {
        return {
          content: [
            {
              type: "text",
              text: `Unknown currency code: ${currencyCode.toUpperCase()}`,
            },
          ],
        };
      }
      return {
        content: [
          {
            type: "text",
            text: `The full name for the currency code "${currencyCode.toUpperCase()}" is: ${fullName}`,
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
      if (
        !availableCurrencies[targetcurrencyCode.toLowerCase()] &&
        !availableCurrencies[sourcecurrencyCode.toLowerCase()]
      ) {
        return {
          content: [
            {
              type: "text",
              text: `Unknown currency code(s): ${targetcurrencyCode}, ${sourcecurrencyCode}`,
            },
          ],
        };
      }

      try {
        const rate = await getConversionRate(
          sourcecurrencyCode,
          targetcurrencyCode
        );
        return {
          content: [
            {
              type: "text",
              text: `Conversion from ${sourcecurrencyCode.toUpperCase()} to ${targetcurrencyCode.toUpperCase()} is ${
                rate * value
              }.`,
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        return {
          content: [
            {
              type: "text",
              text: `Failed to get conversion rate: ${errorMessage}`,
            },
          ],
        };
      }
    }
  );
}
