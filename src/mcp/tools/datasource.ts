import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DataSourcesApi } from "../../client/mod.ts";
import type { RedashClient } from "../../client/mod.ts";

export function registerDataSourceTools(server: McpServer, client: RedashClient): void {
  const api = new DataSourcesApi(client);

  server.tool("datasource_list", "List all data sources", async () => {
    const result = await api.list();
    return { content: [{ type: "text" as const, text: JSON.stringify(result) }] };
  });

  server.tool("datasource_get", "Get a data source by ID", {
    id: z.number(),
  }, async ({ id }) => {
    const result = await api.get(id);
    return { content: [{ type: "text" as const, text: JSON.stringify(result) }] };
  });

  server.tool("datasource_create", "Create a new data source", {
    name: z.string(),
    type: z.string(),
    options: z.record(z.unknown()),
  }, async (input) => {
    const result = await api.create(input);
    return { content: [{ type: "text" as const, text: JSON.stringify(result) }] };
  });

  server.tool("datasource_update", "Update an existing data source", {
    id: z.number(),
    name: z.string().optional(),
    options: z.record(z.unknown()).optional(),
  }, async ({ id, ...data }) => {
    const result = await api.update(id, data);
    return { content: [{ type: "text" as const, text: JSON.stringify(result) }] };
  });

  server.tool("datasource_delete", "Delete a data source by ID", {
    id: z.number(),
  }, async ({ id }) => {
    await api.delete(id);
    return { content: [{ type: "text" as const, text: JSON.stringify({ success: true }) }] };
  });
}
