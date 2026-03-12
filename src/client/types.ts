export interface RedashConfig {
  url: string;
  apiKey: string;
}

export interface PaginatedResponse<T> {
  count: number;
  page: number;
  page_size: number;
  results: T[];
}

export interface Query {
  id: number;
  name: string;
  description: string;
  query: string;
  data_source_id: number;
  schedule: Record<string, unknown> | null;
  is_archived: boolean;
  is_draft: boolean;
  created_at: string;
  updated_at: string;
}

export interface Dashboard {
  id: number;
  name: string;
  slug: string;
  is_archived: boolean;
  is_draft: boolean;
  created_at: string;
  updated_at: string;
  widgets: unknown[];
}

export interface DataSource {
  id: number;
  name: string;
  type: string;
  options: Record<string, unknown>;
  created_at: string;
}

export interface QueryResult {
  query_result: {
    id: number;
    query: string;
    data: {
      columns: { name: string; type: string }[];
      rows: Record<string, unknown>[];
    };
    retrieved_at: string;
  };
}

export interface Job {
  job: {
    id: string;
    status: number;
    error: string;
    query_result_id: number | null;
  };
}

export interface RedashError {
  error: true;
  status: number;
  message: string;
}
