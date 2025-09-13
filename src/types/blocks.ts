import type { HeroSection } from "./heroSection";
import type { ExploreSection } from "./ExploreSection";

// Type de base pour tous les blocs
export type BlockBase = {
  id: string | number;
  __component: string;
};

// Types des blocs spécifiques
export type BlockTypes = HeroSection | ExploreSection | Record<string, unknown>; // Pour les autres types de blocs
