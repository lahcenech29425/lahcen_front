export interface StatItem {
  id: string | number;
  value: string;
  label: string;
  description?: string;
}

export interface StatsSectionType {
  id: string | number;
  title: string;
  subtitle: string;
  stats: StatItem[];
}
