export async function fetchSurahList() {
  const res = await fetch("https://api.alquran.cloud/v1/surah", {
    next: {
      revalidate: 31536000,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch surah list");
  const data = await res.json();
  return data.data;
}

export async function fetchSurahDetail(surahNo: number) {
  const res = await fetch(`https://quranapi.pages.dev/api/${surahNo}.json`, {
    next: {
      revalidate: 31536000,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch surah detail");
  return res.json();
}

// Types pour le tafsir
export type TafseerAuthor = {
  id: number;
  name: string;
  language: string;
  author: string;
  book_name: string;
};

export type TafseerContent = {
  tafseer_id: number;
  tafseer_name: string;
  ayah_url: string;
  ayah_number: number;
  text: string;
};

// Mapping des ID tafsir vers les slugs de l'API
const tafsirMap: Record<number, string> = {
  1: "ar-tafsir-muyassar",
  2: "ar-tafsir-ibn-kathir",
  3: "ar-tafsir-al-baghawi",
  4: "ar-tafseer-tanwir-al-miqbas",
  5: "ar-tafsir-al-wasit",
  6: "ar-tafsir-al-tabari",
  7: "ar-tafseer-al-qurtubi",
  8: "ar-tafseer-al-saddi",
};

// Tafsirs arabes par défaut à afficher si l'API ne répond pas
const defaultArabicTafsirs: TafseerAuthor[] = [
  {
    id: 1,
    name: "التفسير الميسر",
    language: "ar",
    author: "نخبة من العلماء",
    book_name: "التفسير الميسر",
  },
  {
    id: 2,
    name: "تفسير ابن كثير",
    language: "ar",
    author: "ابن كثير",
    book_name: "تفسير ابن كثير",
  },
  {
    id: 7,
    name: "تفسير القرطبي",
    language: "ar",
    author: "القرطبي",
    book_name: "تفسير القرطبي",
  },
  {
    id: 8,
    name: "تفسير السعدي",
    language: "ar",
    author: "السعدي",
    book_name: "تفسير السعدي",
  },
];

// Fonction pour récupérer la liste des tafsirs disponibles
export async function fetchTafseerList(): Promise<TafseerAuthor[]> {
  try {
    // Retourne directement la liste par défaut pour éviter les problèmes avec l'API
    return defaultArabicTafsirs;
  } catch (error) {
    console.error("Error fetching tafseer list:", error);
    return defaultArabicTafsirs;
  }
}

// Fonction pour récupérer le tafsir d'un verset spécifique
export async function fetchAyahTafseer(
  tafseerID: number,
  surahNo: number,
  ayahNo: number
): Promise<TafseerContent> {
  // Obtenir le slug du tafsir
  const tafseerSlug = tafsirMap[tafseerID] || "ar-tafsir-muyassar";

  try {
    const res = await fetch(
      `https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/${tafseerSlug}/${surahNo}/${ayahNo}.json`
    );

    if (!res.ok) throw new Error(`Failed to fetch tafsir`);

    const data = await res.json();

    // Formater la réponse
    return {
      tafseer_id: tafseerID,
      tafseer_name: getTafsirName(tafseerID),
      ayah_url: `/quran/${surahNo}/${ayahNo}`,
      ayah_number: ayahNo,
      text: data.text,
    };
  } catch (error) {
    console.error(`Error fetching tafsir:`, error);

    // Retourne une réponse par défaut en cas d'erreur
    return {
      tafseer_id: tafseerID,
      tafseer_name: getTafsirName(tafseerID),
      ayah_url: `/quran/${surahNo}/${ayahNo}`,
      ayah_number: ayahNo,
      text: "عذراً، لم نتمكن من العثور على تفسير لهذه الآية.",
    };
  }
}

// Helper pour obtenir le nom du tafsir
function getTafsirName(tafseerID: number): string {
  const tafsir = defaultArabicTafsirs.find((t) => t.id === tafseerID);
  return tafsir?.name || "التفسير";
}
