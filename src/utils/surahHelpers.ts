export function getSurahSlug(surah: { englishName: string }): string {
  return surah.englishName.toLowerCase();
}

export async function getSurahNumberFromSlug(slug: string): Promise<number> {
  // Si c'est déjà un nombre, le retourner
  if (/^\d+$/.test(slug)) return Number(slug);

  // Fetch la liste pour trouver le number correspondant au englishName
  const response = await fetch("https://api.alquran.cloud/v1/surah");
  const data = await response.json();

  if (data.code === 200 && data.data) {
    const surah = data.data.find(
      (s: { englishName: string }) => s.englishName.toLowerCase() === slug.toLowerCase()
    );
    return surah ? surah.number : 1;
  }

  return 1;
}
