// src/components/blocks/BlockRenderer.tsx
import HeroSection from "./hero_section/HeroSection";
import StatsSection from "./stats_section/StatsSection";
import ExploreSection from "./explore_section/ExploreSection";
import Slider from "./slider/Slider";
import ServicesSection from "./services_section/ServicesSection";
import type { BlockData } from "@/types/blocks";
import { Slider as SliderType } from "@/types/slider";
import type { ServicesSection as ServicesSectionType } from "@/types/servicesSection";
// Importer les types spécifiques des blocs
import type { HeroSection as HeroSectionType } from "@/types/heroSection";
import type { ExploreSection as ExploreSectionType } from "@/types/ExploreSection";
import { StatsSectionType } from "@/types/statsSection";
// Importez les autres types si nécessaire

export default function BlockRenderer({ blocks }: { blocks: BlockData[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.__component) {
          case "blocks.hero-section":
            // Utiliser une assertion de type pour indiquer le type spécifique
            return <HeroSection key={block.id} data={block as unknown as HeroSectionType} />;
          case "blocks.stats-section":
            return <StatsSection key={block.id} data={block as unknown as StatsSectionType} />;
          case "blocks.slider":
            return <Slider key={block.id} data={block as unknown as SliderType} />;
          case "blocks.explore-section":
            return <ExploreSection key={block.id} data={block as unknown as ExploreSectionType} index={i} />;
          case "blocks.services-section":
            return <ServicesSection key={block.id} data={block as unknown as ServicesSectionType} />;
          default:
            return null;
        }
      })}
    </>
  );
}
