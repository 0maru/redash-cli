import type { RedashClient } from "./client.ts";
import type { Job, PaginatedResponse, Query, QueryResult } from "./types.ts";

export class QueriesApi {
  constructor(private client: RedashClient) {}

  list(page = 1, pageSize = 25): Promise<PaginatedResponse<Query>> {
    return this.client.get(`/api/queries?page=${page}&page_size=${pageSize}`);
  }

  get(id: number): Promise<Query> {
    return this.client.get(`/api/queries/${id}`);
  }

  create(data: { name: string; query: string; data_source_id: number; description?: string }): Promise<Query> {
    return this.client.post("/api/queries", data);
  }

  update(id: number, data: { name?: string; query?: string; description?: string }): Promise<Query> {
    return this.client.put(`/api/queries/${id}`, data);
  }

  delete(id: number): Promise<void> {
    return this.client.delete(`/api/queries/${id}`);
  }

  execute(queryId: number, dataSourceId: number): Promise<Job> {
    return this.client.post("/api/query_results", {
      query_id: queryId,
      data_source_id: dataSourceId,
    });
  }

  getJob(jobId: string): Promise<Job> {
    return this.client.get(`/api/jobs/${jobId}`);
  }

  getResult(queryId: number): Promise<QueryResult> {
    return this.client.get(`/api/queries/${queryId}/results.json`);
  }

  async executeAndWait(queryId: number, dataSourceId: number, timeoutMs = 60000): Promise<QueryResult> {
    const job = await this.execute(queryId, dataSourceId);
    const start = Date.now();
    const jobId = job.job.id;

    while (Date.now() - start < timeoutMs) {
      const status = await this.getJob(jobId);
      if (status.job.status === 3 && status.job.query_result_id) {
        return this.client.get(`/api/query_results/${status.job.query_result_id}`);
      }
      if (status.job.status === 4) {
        throw new Error(JSON.stringify({ error: true, status: 500, message: `Job failed: ${status.job.error}` }));
      }
      await new Promise((r) => setTimeout(r, 1000));
    }
    throw new Error(JSON.stringify({ error: true, status: 408, message: "Query execution timed out" }));
  }
}
