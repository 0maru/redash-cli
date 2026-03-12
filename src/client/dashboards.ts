import type { RedashClient } from "./client.ts";
import type { Dashboard, PaginatedResponse } from "./types.ts";

export class DashboardsApi {
  constructor(private client: RedashClient) {}

  list(page = 1, pageSize = 25): Promise<PaginatedResponse<Dashboard>> {
    return this.client.get(`/api/dashboards?page=${page}&page_size=${pageSize}`);
  }

  get(id: number): Promise<Dashboard> {
    return this.client.get(`/api/dashboards/${id}`);
  }

  create(data: { name: string }): Promise<Dashboard> {
    return this.client.post("/api/dashboards", data);
  }

  update(id: number, data: { name?: string }): Promise<Dashboard> {
    return this.client.put(`/api/dashboards/${id}`, data);
  }

  delete(id: number): Promise<void> {
    return this.client.delete(`/api/dashboards/${id}`);
  }
}
