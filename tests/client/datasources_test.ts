import { assertEquals } from "@std/assert";
import { RedashClient } from "../../src/client/client.ts";
import { DataSourcesApi } from "../../src/client/datasources.ts";

Deno.test("DataSourcesApi.list - returns data sources", async () => {
  const server = Deno.serve({ port: 0, onListen: () => {} }, () =>
    new Response(JSON.stringify([{ id: 1, name: "pg", type: "pg" }]))
  );
  try {
    const { port } = server.addr as Deno.NetAddr;
    const client = new RedashClient({ url: `http://localhost:${port}`, apiKey: "k" });
    const api = new DataSourcesApi(client);
    const result = await api.list();
    assertEquals(result[0].name, "pg");
  } finally {
    await server.shutdown();
  }
});
