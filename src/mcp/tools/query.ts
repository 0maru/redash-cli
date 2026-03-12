import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { QueriesApi } from "../../client/mod.ts";
import type { RedashClient } from "../../client/mod.ts";

export function registerQueryTools(server: McpServer, client: RedashClient): void {
  const api = new QueriesApi(client);

  server.tool("query_list", "List all queries with pagination", {
    page: z.number().optional().default(1),
    page_size: z.number().optional().default(25),
  }, async ({ page, page_size }) => {
    const result = await api.list(page, page_size);
    return { content: [{ type: "text" as const, text: JSON.stringify(result) }] };
  });

  server.tool("query_get", "Get a query by ID", {
    id: z.number(),
  }, async ({ id }) => {
    const result = await api.get(id);
    return { content: [{ type: "text" as const, text: JSON.stringify(result) }] };
  });

  server.tool("query_create", "Create a new query", {
    name: z.string(),
    query: z.string(),
    data_source_id: z.number(),
    description: z.string().optional(),
  }, async (input) => {
    const result = await api.create(input);
    return { content: [{ type: "text" as const, text: JSON.stringify(result) }] };
  });

  server.tool("query_update", "Update an existing query", {
    id: z.number(),
    name: z.string().optional(),
    query: z.string().optional(),
  }, async ({ id, ...data }) => {
    const result = await api.update(id, data);
    return { content: [{ type: "text" as const, text: JSON.stringify(result) }] };
  });

  server.tool("query_delete", "Delete a query by ID", {
    id: z.number(),
  }, async ({ id }) => {
    await api.delete(id);
    return { content: [{ type: "text" as const, text: JSON.stringify({ success: true }) }] };
  });

  server.tool("query_execute", "Execute a query and wait for results", {
    id: z.number(),
  }, async ({ id }) => {
    const query = await api.get(id);
    const result = await api.executeAndWait(id, query.data_source_id);
    return { content: [{ type: "text" as const, text: JSON.stringify(result) }] };
  });

  server.tool("query_results", "Get the latest cached results for a query", {
    id: z.number(),
  }, async ({ id }) => {
    const result = await api.getResult(id);
    return { content: [{ type: "text" as const, text: JSON.stringify(result) }] };
  });
}
