export interface ImageType {
  id: string | number;
  url: string;
  alt: string;
  width?: number;
  height?: number;
  mime?: string;
  alternativeText?: string;
  caption?: string;
}
