import { assertEquals, assertRejects } from "@std/assert";
import { RedashClient } from "../../src/client/client.ts";

Deno.test("RedashClient - GET request adds auth header", async () => {
  const server = Deno.serve({ port: 0, onListen: () => {} }, (req) => {
    assertEquals(req.headers.get("Authorization"), "Key test-api-key");
    assertEquals(new URL(req.url).pathname, "/api/queries");
    return new Response(JSON.stringify({ results: [] }), { status: 200 });
  });
  try {
    const { port } = server.addr as Deno.NetAddr;
    const client = new RedashClient({ url: `http://localhost:${port}`, apiKey: "test-api-key" });
    const result = await client.get("/api/queries");
    assertEquals(result, { results: [] });
  } finally {
    await server.shutdown();
  }
});

Deno.test("RedashClient - POST request sends body", async () => {
  const server = Deno.serve({ port: 0, onListen: () => {} }, (req) => {
    assertEquals(req.method, "POST");
    return new Response(JSON.stringify({ id: 1 }), { status: 200 });
  });
  try {
    const { port } = server.addr as Deno.NetAddr;
    const client = new RedashClient({ url: `http://localhost:${port}`, apiKey: "test-api-key" });
    const result = await client.post("/api/queries", { name: "test" });
    assertEquals(result, { id: 1 });
  } finally {
    await server.shutdown();
  }
});

Deno.test("RedashClient - handles API error", async () => {
  const server = Deno.serve({ port: 0, onListen: () => {} }, () => {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  });
  try {
    const { port } = server.addr as Deno.NetAddr;
    const client = new RedashClient({ url: `http://localhost:${port}`, apiKey: "bad-key" });
    await assertRejects(
      () => client.get("/api/queries"),
      Error,
      "401",
    );
  } finally {
    await server.shutdown();
  }
});
