import { startMcpServer } from "../../mcp/mod.ts";

export async function handleMcpServe(): Promise<void> {
  await startMcpServer();
}
