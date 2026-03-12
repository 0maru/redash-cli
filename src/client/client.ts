import type { RedashConfig, RedashError } from "./types.ts";

export class RedashClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(config: RedashConfig) {
    this.baseUrl = config.url.replace(/\/$/, "");
    this.apiKey = config.apiKey;
  }

  private headers(): HeadersInit {
    return {
      "Authorization": `Key ${this.apiKey}`,
      "Content-Type": "application/json",
    };
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const res = await fetch(url, {
      method,
      headers: this.headers(),
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const text = await res.text();
      let message: string;
      try {
        const json = JSON.parse(text);
        message = json.message ?? text;
      } catch {
        message = text;
      }
      const error: RedashError = { error: true, status: res.status, message };
      throw new Error(JSON.stringify(error));
    }

    return res.json() as Promise<T>;
  }

  get<T>(path: string): Promise<T> {
    return this.request<T>("GET", path);
  }

  post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>("POST", path, body);
  }

  put<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>("PUT", path, body);
  }

  delete<T>(path: string): Promise<T> {
    return this.request<T>("DELETE", path);
  }
}
