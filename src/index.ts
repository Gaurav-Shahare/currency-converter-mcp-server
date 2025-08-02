import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getAvailableCurrencies, CurrencyDataRecord } from "./api.js";
import { registerTools } from "./tools.js";

async function main() {
  let availableCurrencies: CurrencyDataRecord = {};
  try {
    availableCurrencies = await getAvailableCurrencies();
  } catch (error) {
    console.error("Error fetching available currencies:", error);
    // Depending on the desired behavior, you might want to exit here
    // process.exit(1);
  }

  const server = new McpServer({
    name: "currency-converter",
    version: "1.0.0",
  });

  registerTools(server, availableCurrencies);

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Currency-converter MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});