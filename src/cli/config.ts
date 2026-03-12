import { join } from "@std/path";
import type { RedashConfig } from "../client/types.ts";

const CONFIG_DIR = join(Deno.env.get("HOME") ?? "~", ".config", "redash-cli");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

export async function loadConfig(): Promise<RedashConfig> {
  const envUrl = Deno.env.get("REDASH_URL");
  const envKey = Deno.env.get("REDASH_API_KEY");

  let fileConfig: Partial<RedashConfig> = {};
  try {
    const text = await Deno.readTextFile(CONFIG_FILE);
    fileConfig = JSON.parse(text);
  } catch {
    // config file doesn't exist, that's fine
  }

  const url = envUrl ?? fileConfig.url;
  const apiKey = envKey ?? fileConfig.apiKey;

  if (!url || !apiKey) {
    throw new Error(JSON.stringify({
      error: true,
      status: 0,
      message: "Missing configuration. Run: redash config set --url <URL> --api-key <KEY>",
    }));
  }

  return { url, apiKey };
}

export async function saveConfig(config: Partial<RedashConfig>): Promise<void> {
  let existing: Partial<RedashConfig> = {};
  try {
    const text = await Deno.readTextFile(CONFIG_FILE);
    existing = JSON.parse(text);
  } catch {
    // no existing config
  }

  const merged = { ...existing, ...config };
  await Deno.mkdir(CONFIG_DIR, { recursive: true });
  await Deno.writeTextFile(CONFIG_FILE, JSON.stringify(merged, null, 2) + "\n");
}

export function maskApiKey(key: string): string {
  if (key.length <= 4) return "****";
  return "*".repeat(key.length - 4) + key.slice(-4);
}
