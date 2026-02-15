import React, { MutableRefObject } from "react";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
import Badge from "@/components/elements/Badge";
import { Download, Share2, Book, Bookmark } from "lucide-react";

type LocalHadithShape = {
  hadithArabic?: string;
  hadithEnglish?: string;
  text?: string;
  hadithNumber?: string | number;
  number?: string | number;
  id?: string | number;
  headingArabic?: string | null;
  book?: { bookName?: string; bookSlug?: string } | null;
  chapter?: {
    chapterArabic?: string;
    chapterEnglish?: string;
    chapterNumber?: string;
  } | null;
  bookSlug?: string;
  chapterId?: string | number;
  status?: string;
  [key: string]: unknown;
};

type HadithCardProps = {
  hadith: LocalHadithShape;
  idx: number;
  cardRefs: MutableRefObject<(HTMLDivElement | null)[]>;
  onDownload: (idx: number) => void;
  bookName?: string;
  chapterLabel?: string;
  status?: string;
};

const statusKey = (s?: string) => (s ?? "").toString().trim().toLowerCase();

const statusArabic = (s?: string) => {
  const k = statusKey(s);
  if (!k) return "—";
  if (["sahih", "صحيح"].includes(k)) return "صحيح";
  if (["hasan", "حسن"].includes(k)) return "حسن";
  if (["da`eef", "daif", "ضعيف", "weak"].includes(k)) return "ضعيف";
  return s ?? "—";
};

export function HadithCard({
  hadith,
  idx,
  cardRefs,
  onDownload,
  bookName,
  chapterLabel,
  status,
}: HadithCardProps) {
  const { ref: fadeRef, visible } = useScrollFadeIn<HTMLDivElement>();

  const setRefs = (el: HTMLDivElement | null) => {
    cardRefs.current[idx] = el;
    if (fadeRef) {
      (fadeRef as MutableRefObject<HTMLDivElement | null>).current = el;
    }
  };

  const h = hadith;
  const numberVal = String(h.hadithNumber ?? h.number ?? h.id ?? "").trim();
  const bookLabel = bookName ?? (h.book?.bookName as string | undefined) ?? "";
  const chapterLabelFinal = chapterLabel ?? (h.chapter?.chapterArabic as string | undefined) ?? "";

  const statusAr = statusArabic(status ?? (h.status as string | undefined));
  const isSahih = statusAr === "صحيح";

  return (
    <div
      ref={setRefs}
      className={`bg-white dark:bg-card rounded-2xl border border-[#8B4513]/10 shadow-sm p-6 md:p-8 relative transition-all duration-500 hover:shadow-xl hover:border-[#8B4513]/30 group ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      {/* Card Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-gray-100 dark:border-[#333] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#8B4513]/10 dark:bg-primary/15 text-[#8B4513] dark:text-primary flex items-center justify-center font-bold">
            {numberVal}
          </div>
          <div>
            <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg flex items-center gap-2">
              <Book size={16} className="text-[#8B4513] dark:text-primary" />
              {bookLabel || "—"}
            </h3>
            {chapterLabelFinal && (
              <span className="text-xs text-gray-500 dark:text-gray-400 block mt-1">{chapterLabelFinal}</span>
            )}
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full text-sm font-medium ${isSahih ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-[#333] dark:text-gray-300'}`}>
          {statusAr}
        </div>
      </div>

      {/* Hadith Text */}
      <div className="mb-8 text-center relative">
        <p className="text-2xl md:text-3xl font-amiri leading-[2.4] text-[#2c1810] dark:text-[#ededed] drop-shadow-sm py-4">
          {h.hadithArabic ?? h.text ?? h.hadithEnglish ?? ""}
        </p>

        {h.headingArabic && (
          <div className="mt-4 text-sm text-[#8B4513]/80 dark:text-primary font-medium bg-[#8B4513]/5 dark:bg-primary/10 inline-block px-4 py-2 rounded-lg">
            {h.headingArabic}
          </div>
        )}
      </div>

      {/* Card Footer / Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-[#333]">
        <div className="text-xs text-gray-400">
          رقم: {numberVal}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onDownload(idx)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#f8f5f2] dark:bg-card text-[#8B4513] dark:text-primary hover:bg-[#8B4513] hover:text-white transition-colors text-sm font-medium"
          >
            <Download size={16} />
            <span className="hidden sm:inline">تحميل صورة</span>
          </button>
        </div>
      </div>
    </div>
  );
}
