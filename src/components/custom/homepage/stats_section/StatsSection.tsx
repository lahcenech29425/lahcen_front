import { StatsSectionType } from "@/types/statsSection";
import { normalizeStatsSection } from "./normalizer";

export default function StatsSection({ data }: { data: StatsSectionType }) {
  const normalized = normalizeStatsSection(data);
  return (
     <section className="bg-gray-50 py-12 md:py-16 text-center px-4">
      <div className="max-w-5xl mx-auto">
        <h3 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">{normalized.title}</h3>
        <p className="text-base md:text-lg text-gray-600 mb-10 max-w-2xl mx-auto">{normalized.subtitle}</p>
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
      </div>
    </section>
  );
}
