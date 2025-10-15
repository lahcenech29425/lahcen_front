const API_KEY = "$2y$10$Prh4o4HQKyUr316kmx1iOOXd89t4QejBRVpljOQPyS33bKLbcZ6";
const BASE_URL = "https://hadithapi.com/api";

// Types pour les réponses de l'API
interface HadithBook {
  bookSlug: string;
  bookName: string;
  bookEnglish?: string;
  bookArabic?: string;
}

interface HadithChapter {
  id: number;
  chapterNumber: string;
  chapterEnglish: string;
  chapterArabic?: string;
}

interface HadithItem {
  id: number;
  hadithNumber: string;
  hadithArabic: string;
  hadithEnglish?: string;
  chapterId: string;
  bookSlug: string;
  headingArabic?: string;
  status: string;
}

interface HadithResponse {
  hadiths: {
    data: HadithItem[];
  };
}

// Types pour les données transformées
interface BookInfo {
  slug: string;
  name: string;
}

interface ChapterInfo {
  id: number;
  number: string;
  name: string;
}

interface HadithInfo {
  id: number;
  number: string;
  text: string;
  chapterId: string;
  bookSlug: string;
  heading?: string;
}

// Récupère la liste des livres (seulement les champs arabes utiles)
export async function fetchHadithBooks(): Promise<BookInfo[]> {
  const res = await fetch(`${BASE_URL}/books?apiKey=${API_KEY}`, {
    next: {
      revalidate: 31536000,
    },
  });
  const data: { books: HadithBook[] } = await res.json();
  // On ne garde que le slug et le nom arabe (ou anglais si pas d'arabe)
  return (data.books || []).map((b: HadithBook) => ({
    slug: b.bookSlug,
    name: b.bookName, // Pas de champ arabe pour le nom du livre dans l'API, donc on garde bookName
  }));
}

// Récupère les chapitres d'un livre (seulement les champs arabes)
export async function fetchChapters(bookSlug: string): Promise<ChapterInfo[]> {
  const res = await fetch(`${BASE_URL}/${bookSlug}/chapters?apiKey=${API_KEY}`);
  const data: { chapters: HadithChapter[] } = await res.json();
  return (data.chapters || []).map((ch: HadithChapter) => ({
    id: ch.id,
    number: ch.chapterNumber,
    name: ch.chapterArabic || ch.chapterEnglish, // Utilise l'arabe si dispo, sinon anglais
  }));
}

// Récupère les hadiths filtrés (seulement les champs arabes)
export async function fetchHadiths({
  book,
  chapter,
  search,
  hadithNumber,
  status,
  page,
  pageSize,
}: {
  book: string;
  chapter?: string;
  search?: string;
  hadithNumber?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): Promise<HadithInfo[]> {
  const params = new URLSearchParams({
    apiKey: API_KEY,
    book,
    ...(chapter ? { chapter } : {}),
    ...(search ? { hadithArabic: search } : {}),
    ...(hadithNumber ? { hadithNumber } : {}),
    ...(status ? { status } : {}),
    ...(pageSize ? { paginate: String(pageSize) } : {}),
    ...(page ? { page: String(page) } : {}),
  });
  const res = await fetch(`${BASE_URL}/hadiths?${params.toString()}`);
  const data: HadithResponse = await res.json();
  // On ne garde que les champs arabes
  return (data.hadiths?.data || []).map((h: HadithItem) => ({
    id: h.id,
    number: h.hadithNumber,
    text: h.hadithArabic,
    chapterId: h.chapterId,
    bookSlug: h.bookSlug,
    heading: h.headingArabic,
    status: h.status,
  }));
}
