import type { ServicesSection, ServiceItem } from "@/types/servicesSection";
import { normalizeImage } from "@/shared/normalizers/normalizeImage";

export function normalizeServicesSection(data: ServicesSection): ServicesSection {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    services: Array.isArray(data.services)
      ? data.services.map((item: ServiceItem) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          link: item.link,
          icon: item.icon ? normalizeImage(item.icon) || undefined : undefined,
        }))
      : [],
  };
}