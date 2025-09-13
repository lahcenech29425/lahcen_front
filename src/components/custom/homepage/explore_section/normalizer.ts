import { ExploreSection } from "@/types/ExploreSection";

export function normalizeExploreSection(data: ExploreSection): ExploreSection {
  return {
    id: data.id,
    title: data.title,
    subtitle: data.subtitle,
    fetchCount: data.fetchCount,
    itemType: data.itemType,
    fetchCondition: data.fetchCondition,
    button: data.button,
  };
}

