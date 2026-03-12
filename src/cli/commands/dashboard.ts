import { loadConfig } from "../config.ts";
import { RedashClient, DashboardsApi } from "../../client/mod.ts";

export async function handleDashboard(action: string, rest: string[], flags: Record<string, unknown>): Promise<void> {
  const config = await loadConfig();
  const client = new RedashClient(config);
  const api = new DashboardsApi(client);

  switch (action) {
    case "list": {
      const page = Number(flags["page"] ?? 1);
      const pageSize = Number(flags["page-size"] ?? 25);
      const result = await api.list(page, pageSize);
      console.log(JSON.stringify(result));
      break;
    }
    case "get": {
      const id = Number(rest[0]);
      const result = await api.get(id);
      console.log(JSON.stringify(result));
      break;
    }
    case "create": {
      const result = await api.create({ name: flags["name"] as string });
      console.log(JSON.stringify(result));
      break;
    }
    case "update": {
      const id = Number(rest[0]);
      const data: Record<string, unknown> = {};
      if (flags["name"]) data.name = flags["name"];
      const result = await api.update(id, data);
      console.log(JSON.stringify(result));
      break;
    }
    case "delete": {
      const id = Number(rest[0]);
      await api.delete(id);
      console.log(JSON.stringify({ success: true }));
      break;
    }
    default:
      throw new Error(JSON.stringify({ error: true, status: 0, message: `Unknown action: dashboard ${action}` }));
  }
}
