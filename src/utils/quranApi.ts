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

// Nouvelles fonctions pour les tafsirs
export async function fetchTafseerList() {
  const res = await fetch("http://api.quran-tafseer.com/tafseer");
  if (!res.ok) throw new Error("Failed to fetch tafseer list");
  return res.json();
}

export async function fetchAyahTafseer(
  tafseerID: number,
  surahNo: number,
  ayahNo: number
) {
  const res = await fetch(
    `http://api.quran-tafseer.com/tafseer/${tafseerID}/${surahNo}/${ayahNo}`
  );
  if (!res.ok)
    throw new Error(
      `Failed to fetch tafseer for surah ${surahNo}, ayah ${ayahNo}`
    );
  return res.json();
}

export async function fetchSurahTafseer(
  tafseerID: number,
  surahNo: number,
  fromAyah: number,
  toAyah: number
) {
  const res = await fetch(
    `http://api.quran-tafseer.com/tafseer/${tafseerID}/${surahNo}/${fromAyah}/${toAyah}`
  );
  if (!res.ok)
    throw new Error(
      `Failed to fetch tafseer for surah ${surahNo} from ayah ${fromAyah} to ${toAyah}`
    );
  return res.json();
}
