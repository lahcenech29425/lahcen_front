import { MemorialPageType } from "@/types/memorial";

export function normalizeMemorialPage(data: any): MemorialPageType {
  // Stub - return static data for now
  return {
    id: 1,
    documentId: "about",
    title: "عن الموقع",
    subtitle: "موقع إسلامي شامل",
    birth_date: "",
    death_date: "",
    biography_content: "",
    section_title: "",
    sadaqah_introduction: "",
    dua_title: "",
    dua_content: "",
    image: [],
    social_media: [],
  };
}
