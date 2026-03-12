import type { RedashClient } from "./client.ts";
import type { DataSource } from "./types.ts";

export class DataSourcesApi {
  constructor(private client: RedashClient) {}

  list(): Promise<DataSource[]> {
    return this.client.get("/api/data_sources");
  }

  get(id: number): Promise<DataSource> {
    return this.client.get(`/api/data_sources/${id}`);
  }

  create(data: { name: string; type: string; options: Record<string, unknown> }): Promise<DataSource> {
    return this.client.post("/api/data_sources", data);
  }

  update(id: number, data: { name?: string; options?: Record<string, unknown> }): Promise<DataSource> {
    return this.client.put(`/api/data_sources/${id}`, data);
  }

  delete(id: number): Promise<void> {
    return this.client.delete(`/api/data_sources/${id}`);
  }
}
