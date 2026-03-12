import { parseArgs } from "@std/cli/parse-args";
import { handleQuery } from "./commands/query.ts";
import { handleDashboard } from "./commands/dashboard.ts";
import { handleDataSource } from "./commands/datasource.ts";
import { handleConfig } from "./commands/config_cmd.ts";
import { handleMcpServe } from "./commands/mcp_serve.ts";

const VERSION = "0.1.0";

const HELP = `redash-cli v${VERSION}

Usage: redash <resource> <action> [options]

Resources:
  query        Manage queries
  dashboard    Manage dashboards
  datasource   Manage data sources
  config       Manage configuration
  mcp-serve    Start MCP server

Options:
  --help       Show help
  --version    Show version`;

export async function run(args: string[]): Promise<void> {
  const parsed = parseArgs(args, {
    boolean: ["help", "version", "wait"],
    string: ["name", "query", "data-source-id", "type", "options", "url", "api-key", "page", "page-size"],
    default: { wait: true },
    negatable: ["wait"],
    alias: { h: "help", v: "version" },
  });

  if (parsed.version) {
    console.log(JSON.stringify({ version: VERSION }));
    return;
  }

  if (parsed.help && parsed._.length === 0) {
    console.log(HELP);
    return;
  }

  const [resource, action, ...rest] = parsed._.map(String);

  try {
    switch (resource) {
      case "query":
        await handleQuery(action, rest, parsed);
        break;
      case "dashboard":
        await handleDashboard(action, rest, parsed);
        break;
      case "datasource":
        await handleDataSource(action, rest, parsed);
        break;
      case "config":
        await handleConfig(action, parsed);
        break;
      case "mcp-serve":
        await handleMcpServe();
        break;
      default:
        console.log(HELP);
        Deno.exit(1);
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      try {
        const parsed = JSON.parse(e.message);
        console.log(JSON.stringify(parsed));
      } catch {
        console.log(JSON.stringify({ error: true, status: 0, message: e.message }));
      }
    }
    Deno.exit(1);
  }
}
