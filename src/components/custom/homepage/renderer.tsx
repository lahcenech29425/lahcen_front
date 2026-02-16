// src/components/blocks/BlockRenderer.tsx
import HeroSection from "./hero_section/HeroSection";
import StatsSection from "./stats_section/StatsSection";
import ExploreSection from "./explore_section/ExploreSection";
import FeatureSection from "./feature_section/FeatureSection";
import Slider from "./slider/Slider";
import ServicesSection from "./services_section/ServicesSection";
import type { BlockData } from "@/types/blocks";
import { Slider as SliderType } from "@/types/slider";
// removed ServicesSectionType import
// Importer les types spécifiques des blocs
import type { HeroSection as HeroSectionType } from "@/types/heroSection";
import type { ExploreSection as ExploreSectionType } from "@/types/ExploreSection";
// removed StatsSectionType import
// Import normalizer
import { normalizeHeroSection } from "./hero_section/normalizer";
// Importez les autres types si nécessaire

export default function BlockRenderer({ blocks }: { blocks: BlockData[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.__component) {
          case "blocks.hero-section":
            // Normalize data before passing to component
            return <HeroSection key={`${block.id}-${i}`} data={normalizeHeroSection(block)} />;
          case "blocks.stats-section":
            return <StatsSection key={`${block.id}-${i}`} />;
          case "blocks.slider":
            return <Slider key={`${block.id}-${i}`} data={block as unknown as SliderType} />;
          case "blocks.explore-section":
            return <ExploreSection key={`${block.id}-${i}`} data={block as unknown as ExploreSectionType} index={i} />;
          case "blocks.feature-section":
            return <FeatureSection key={`${block.id}-${i}`} data={block as any} index={i} />;
          case "blocks.services-section":
            return <ServicesSection key={`${block.id}-${i}`} />;
          default:
            return null;
        }
      })}
    </>
  );
}
