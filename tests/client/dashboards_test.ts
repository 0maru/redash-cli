import { assertEquals } from "@std/assert";
import { RedashClient } from "../../src/client/client.ts";
import { DashboardsApi } from "../../src/client/dashboards.ts";

Deno.test("DashboardsApi.list - returns paginated dashboards", async () => {
  const server = Deno.serve({ port: 0, onListen: () => {} }, () =>
    new Response(JSON.stringify({ count: 1, page: 1, page_size: 25, results: [{ id: 1, name: "d1" }] }))
  );
  try {
    const { port } = server.addr as Deno.NetAddr;
    const client = new RedashClient({ url: `http://localhost:${port}`, apiKey: "k" });
    const api = new DashboardsApi(client);
    const result = await api.list();
    assertEquals(result.count, 1);
  } finally {
    await server.shutdown();
  }
});

Deno.test("DashboardsApi.get - returns single dashboard", async () => {
  const server = Deno.serve({ port: 0, onListen: () => {} }, () =>
    new Response(JSON.stringify({ id: 1, name: "d1", widgets: [] }))
  );
  try {
    const { port } = server.addr as Deno.NetAddr;
    const client = new RedashClient({ url: `http://localhost:${port}`, apiKey: "k" });
    const api = new DashboardsApi(client);
    const result = await api.get(1);
    assertEquals(result.id, 1);
  } finally {
    await server.shutdown();
  }
});
