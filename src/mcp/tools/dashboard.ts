import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DashboardsApi } from "../../client/mod.ts";
import type { RedashClient } from "../../client/mod.ts";

export function registerDashboardTools(server: McpServer, client: RedashClient): void {
  const api = new DashboardsApi(client);

  server.tool("dashboard_list", "List all dashboards with pagination", {
    page: z.number().optional().default(1),
    page_size: z.number().optional().default(25),
  }, async ({ page, page_size }) => {
    const result = await api.list(page, page_size);
    return { content: [{ type: "text" as const, text: JSON.stringify(result) }] };
  });

  server.tool("dashboard_get", "Get a dashboard by ID", {
    id: z.number(),
  }, async ({ id }) => {
    const result = await api.get(id);
    return { content: [{ type: "text" as const, text: JSON.stringify(result) }] };
  });

  server.tool("dashboard_create", "Create a new dashboard", {
    name: z.string(),
  }, async ({ name }) => {
    const result = await api.create({ name });
    return { content: [{ type: "text" as const, text: JSON.stringify(result) }] };
  });

  server.tool("dashboard_update", "Update an existing dashboard", {
    id: z.number(),
    name: z.string().optional(),
  }, async ({ id, ...data }) => {
    const result = await api.update(id, data);
    return { content: [{ type: "text" as const, text: JSON.stringify(result) }] };
  });

  server.tool("dashboard_delete", "Delete a dashboard by ID", {
    id: z.number(),
  }, async ({ id }) => {
    await api.delete(id);
    return { content: [{ type: "text" as const, text: JSON.stringify({ success: true }) }] };
  });
}
