"use client";
import BlockRenderer from "./renderer";
import type { BlockBase, BlockTypes } from "@/types/blocks"; // Import des types que tu as définis pour les blocs

// Définis un type pour la structure de homepage
type Homepage = {
  sections: (BlockBase & BlockTypes)[];
  // Ajoute d'autres champs si nécessaire
};

export default function HomeWidget({ homepage }: { homepage: Homepage }) {
  return (
    <main className="">
      <BlockRenderer blocks={homepage.sections} />
    </main>
  );
}
