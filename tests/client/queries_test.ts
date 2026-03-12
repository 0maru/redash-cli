import { assertEquals } from "@std/assert";
import { RedashClient } from "../../src/client/client.ts";
import { QueriesApi } from "../../src/client/queries.ts";

Deno.test("QueriesApi.list - returns paginated queries", async () => {
  const server = Deno.serve({ port: 0, onListen: () => {} }, () =>
    new Response(JSON.stringify({ count: 1, page: 1, page_size: 25, results: [{ id: 1, name: "q1" }] }))
  );
  try {
    const { port } = server.addr as Deno.NetAddr;
    const client = new RedashClient({ url: `http://localhost:${port}`, apiKey: "k" });
    const api = new QueriesApi(client);
    const result = await api.list();
    assertEquals(result.count, 1);
    assertEquals(result.results[0].name, "q1");
  } finally {
    await server.shutdown();
  }
});

Deno.test("QueriesApi.get - returns single query", async () => {
  const server = Deno.serve({ port: 0, onListen: () => {} }, () =>
    new Response(JSON.stringify({ id: 1, name: "q1", query: "SELECT 1" }))
  );
  try {
    const { port } = server.addr as Deno.NetAddr;
    const client = new RedashClient({ url: `http://localhost:${port}`, apiKey: "k" });
    const api = new QueriesApi(client);
    const result = await api.get(1);
    assertEquals(result.id, 1);
  } finally {
    await server.shutdown();
  }
});

Deno.test("QueriesApi.execute - returns job", async () => {
  const server = Deno.serve({ port: 0, onListen: () => {} }, () =>
    new Response(JSON.stringify({ job: { id: "abc", status: 1, error: "", query_result_id: null } }))
  );
  try {
    const { port } = server.addr as Deno.NetAddr;
    const client = new RedashClient({ url: `http://localhost:${port}`, apiKey: "k" });
    const api = new QueriesApi(client);
    const result = await api.execute(1, 1);
    assertEquals(result.job.id, "abc");
  } finally {
    await server.shutdown();
  }
});
