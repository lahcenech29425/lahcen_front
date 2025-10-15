export async function fetchApi(endpoint: string) {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const url = `${baseUrl}${endpoint}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 31536000 },
  });
  if (!res.ok) throw new Error(`Failed to fetch: ${url}`);
  const { data } = await res.json();
  return data;
}
