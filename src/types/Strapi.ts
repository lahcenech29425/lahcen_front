export type StrapiFetchMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface StrapiFetchOptions {
  method?: StrapiFetchMethod;
  body?: unknown;
  jwt?: string;
  headers?: Record<string, string>;
}
