import { StatsSectionType, StatItem } from "@/types/statsSection";

export function normalizeStatsSection(data: StatsSectionType): StatsSectionType {
  return {
    id: data.id,
    title: data.title || "",
    subtitle: data.subtitle || "",
    stats: Array.isArray(data.stats)
      ? data.stats.map((stat: StatItem) => ({
          id: stat.id,
          value: stat.value || "",
          label: stat.label || "",
          description: stat.description || "",
        }))
      : [],
  };
}
