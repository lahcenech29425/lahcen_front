import type { ImageType } from "@/types/image";

export interface ServiceItem {
  id: number;
  title: string;
  description: string;
  link: string;
  icon?: ImageType; 
}

export interface ServicesSection {
  id: number;
  title: string;
  description: string;
  services: ServiceItem[];
}