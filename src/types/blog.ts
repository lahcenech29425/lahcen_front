import type { ImageType } from "@/types/image";

export interface BlogType {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  image: ImageType; 
}
