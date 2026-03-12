import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "../cli/config.ts";
import { RedashClient } from "../client/mod.ts";
import { registerQueryTools } from "./tools/query.ts";
import { registerDashboardTools } from "./tools/dashboard.ts";
import { registerDataSourceTools } from "./tools/datasource.ts";

export async function startMcpServer(): Promise<void> {
  const config = await loadConfig();
  const client = new RedashClient(config);

  const server = new McpServer({
    name: "redash-cli",
    version: "0.1.0",
  });

  registerQueryTools(server, client);
  registerDashboardTools(server, client);
  registerDataSourceTools(server, client);

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Redash MCP Server running on stdio");
}
