"use client";
import BlockRenderer from "./renderer";
import type { BlockData } from "@/types/blocks";

// Définis un type pour la structure de homepage
type Homepage = {
  sections: BlockData[];
  // Ajoute d'autres champs si nécessaire
};

export default function HomeWidget({ homepage }: { homepage: Homepage }) {
  return (
    <main className="">
      <BlockRenderer blocks={homepage.sections} />
    </main>
  );
}
