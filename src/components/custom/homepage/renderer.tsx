// src/components/blocks/BlockRenderer.tsx
import HeroSection from "./hero_section/HeroSection";
import StatsSection from "./stats_section/StatsSection";
import ExploreSection from "./explore_section/ExploreSection";
import Slider from "./slider/Slider";
import ServicesSection from "./services_section/ServicesSection";

// Type de base pour tous les blocs
type BlockBase = {
  id: string | number;
  __component: string;
};

// Définir les types spécifiques pour chaque bloc
interface BlockData extends BlockBase {
  [key: string]: unknown; // Pour les propriétés spécifiques à chaque bloc
}

export default function BlockRenderer({ blocks }: { blocks: BlockData[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.__component) {
          case "blocks.hero-section":
            return <HeroSection key={block.id} data={block} />;
          case "blocks.stats-section":
            return <StatsSection key={block.id} data={block} />;
          case "blocks.slider":
            return <Slider key={block.id} data={block} />;
          case "blocks.explore-section":
            return <ExploreSection key={block.id} data={block} index={i} />;
          case "blocks.services-section":
            return <ServicesSection key={block.id} data={block} />;
          default:
            return null;
        }
      })}
    </>
  );
}
