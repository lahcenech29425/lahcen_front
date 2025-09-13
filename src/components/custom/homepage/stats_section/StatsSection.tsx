import { StatsSectionType } from "@/types/statsSection";
import { normalizeStatsSection } from "./normalizer";

export default function StatsSection({ data }: { data: StatsSectionType }) {
  const normalized = normalizeStatsSection(data);
  return (
    <section className="bg-white py-16 text-center">
      <h3 className="text-4xl font-bold mb-2">{normalized.title}</h3>
      <p className="text-lg text-gray-600 mb-8">{normalized.subtitle}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {normalized.stats.map((stat) => (
          <div key={stat.id} className="rounded-lg p-6">
            <div className="text-3xl font-bold text-primary mb-2">
              {stat.value}
            </div>
            <div className="text-lg font-semibold text-gray-900 mb-1">
              {stat.label}
            </div>
            {stat.description && (
              <div className="text-gray-500 text-sm">{stat.description}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
