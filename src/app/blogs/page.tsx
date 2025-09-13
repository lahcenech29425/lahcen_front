import BlogList from "@/components/custom/blog/BlogList";
import { fetchApi } from "@/utils/fetchApi";

export default async function BlogPage() {
  const blogs = await fetchApi('/api/blogs?populate=*');
  return <BlogList data={blogs} />;
}