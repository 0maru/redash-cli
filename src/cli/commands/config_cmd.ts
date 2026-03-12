import { loadConfig, saveConfig, maskApiKey } from "../config.ts";

export async function handleConfig(action: string, flags: Record<string, unknown>): Promise<void> {
  switch (action) {
    case "set": {
      const data: Record<string, string> = {};
      if (flags["url"]) data.url = flags["url"] as string;
      if (flags["api-key"]) data.apiKey = flags["api-key"] as string;
      await saveConfig(data);
      console.log(JSON.stringify({ success: true }));
      break;
    }
    case "show": {
      const config = await loadConfig();
      console.log(JSON.stringify({
        url: config.url,
        apiKey: maskApiKey(config.apiKey),
      }));
      break;
    }
    default:
      throw new Error(JSON.stringify({ error: true, status: 0, message: `Unknown action: config ${action}` }));
  }
}
