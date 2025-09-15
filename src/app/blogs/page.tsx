import BlogList from "@/components/custom/blog/BlogList";
import { fetchApi } from "@/utils/fetchApi";

export default async function BlogPage() {
  // Récupérer tous les blogs côté serveur
  const data = await fetchApi("/api/blogs?populate=*");

  return <BlogList data={data} />;
}
