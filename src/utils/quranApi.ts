export async function fetchSurahList() {
  const res = await fetch("https://api.alquran.cloud/v1/surah");
  if (!res.ok) throw new Error("Failed to fetch surah list");
  const data = await res.json();
  return data.data; 
}

export async function fetchSurahDetail(surahNo: number) {
  const res = await fetch(`https://quranapi.pages.dev/api/${surahNo}.json`);
  if (!res.ok) throw new Error("Failed to fetch surah detail");
  return res.json();
}