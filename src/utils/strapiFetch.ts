import { StrapiFetchOptions } from "@/types/Strapi";

export async function strapiFetch<T = unknown>(
  endpoint: string,
  {
    method = "GET",
    body,
    jwt,
    headers = { "Content-Type": "application/json" },
  }: StrapiFetchOptions = {}
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const url = `${baseUrl}${endpoint}`;
  const finalHeaders: Record<string, string> = { ...headers };
  if (jwt) finalHeaders["Authorization"] = jwt;
  const options: RequestInit = {
    method,
    headers: finalHeaders,
  };
  console.log('response from strapiFetch:', finalHeaders);
  if (body && method !== "GET") options.body = JSON.stringify(body);

  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok)
    throw new Error(data?.error?.message || `Failed to fetch: ${url}`);
  return data as T;
}
