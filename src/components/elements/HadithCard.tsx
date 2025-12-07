import React, { MutableRefObject } from "react";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
import Badge from "@/components/elements/Badge";

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
  const chapterLabelFinal =
    chapterLabel ?? (h.chapter?.chapterArabic as string | undefined) ?? "";

  const statusAr = statusArabic(status ?? (h.status as string | undefined));

  return (
    <div className="flex flex-col items-stretch gap-3">
      <div
        ref={setRefs}
        className={`rounded-xl shadow-md group transition hover:shadow-lg ${
          visible ? "animate-fade-in" : ""
        } bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#1a1a1a]`}
        style={{
          padding: "1.25rem",
          width: "100%",
        }}
      >
        {/* Header: badge + title/number on LEFT, book & chapter centered, spacer RIGHT */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 items-start md:items-center">
          {/* LEFT: status badge + title + number */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex flex-col min-w-0">
                <span
                  className="text-base hidden md:block font-semibold truncate text-[#171717] dark:text-[#ededed]"
                  title={h.headingArabic ?? h.hadithEnglish ?? undefined}
                >
                  رقم الحديث
                </span>

                <span className="hidden md:inline text-md text-center text-gray-600 dark:text-gray-300 mt-1">
                  <span className="font-medium">{numberVal || "—"}</span>
                </span>
              </div>
            </div>

            {/* mobile number row */}
            <div className="md:hidden text-xs text-gray-600 dark:text-gray-300">
              رقم الحديث:&nbsp;
              <span className="font-medium">{numberVal || "—"}</span>
            </div>
          </div>

          {/* CENTER: book & chapter (centered) */}
          <div className="flex flex-col items-center justify-center text-center">
            <span
              className="text-base font-semibold text-gray-900 dark:text-white truncate max-w-[260px]"
              title={bookLabel || undefined}
            >
              {bookLabel || "—"}
            </span>

            {chapterLabelFinal ? (
              <span
                className="text-xs text-gray-600 dark:text-gray-300 bg-white/60 dark:bg-[#232323]/60 border border-gray-200 dark:border-[#1a1a1a] px-2 py-1 rounded-full mt-2 whitespace-nowrap"
                title={chapterLabelFinal}
              >
                {chapterLabelFinal}
              </span>
            ) : null}
          </div>

          {/* RIGHT: spacer (keeps layout balanced) */}
          <div className="flex items-center justify-center md:justify-end">
            <Badge className="bg-[#171717] dark:bg-[#ededed] text-white dark:text-[#232323] px-3 py-1 rounded-full text-sm">
              {statusAr}
            </Badge>
          </div>
        </div>

        {/* Body: Arabic text */}
        <div className="mt-4">
          <p
            className="text-2xl md:text-3xl font-arabic text-center text-gray-800 dark:text-gray-200 leading-relaxed select-text tracking-wide"
            dir="rtl"
            title={h.hadithArabic ?? h.text ?? h.hadithEnglish ?? ""}
          >
            {h.hadithArabic ?? h.text ?? h.hadithEnglish ?? ""}
          </p>
        </div>

        {/* optional heading */}
        {h.headingArabic ? (
          <div
            className="mt-3 text-center text-gray-500 dark:text-gray-400 text-sm"
            dir="rtl"
          >
            {h.headingArabic}
          </div>
        ) : null}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => onDownload(idx)}
          className="px-3 py-1 rounded-full bg-gray-100 dark:bg-[#232323] text-gray-900 dark:text-[#ededed] text-sm hover:bg-gray-800 dark:hover:bg-[#1a1a1a] hover:text-white dark:hover:text-white cursor-pointer transition-shadow shadow"
          style={{ direction: "ltr" }}
        >
          تحميل
        </button>
      </div>
    </div>
  );
}
