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
        }`}
        style={{
          // restored original site background + border
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          border: "1px solid #e2e8f0",
          padding: "1.25rem",
          width: "100%",
        }}
      >
        {/* Header: badge + title/number on LEFT, book & chapter centered, spacer RIGHT */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 items-start md:items-center">
          {/* LEFT: status badge + title + number */}
          <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex flex-col min-w-0">
                <span
                  className="text-base font-semibold truncate"
                  title={h.headingArabic ?? h.hadithEnglish ?? undefined}
                  style={{ color: "#171717" }}
                >
                  رقم الحديث
                </span>

                <span className="hidden md:inline text-md text-center text-gray-600 mt-1">
                  <span className="font-medium">{numberVal || "—"}</span>
                </span>
              </div>
            </div>

            {/* mobile number row */}
            <div className="md:hidden text-xs text-gray-600">
              رقم الحديث:&nbsp;
              <span className="font-medium">{numberVal || "—"}</span>
            </div>
          </div>

          {/* CENTER: book & chapter (centered) */}
          <div className="flex flex-col items-center justify-center text-center">
            <span
              className="text-base font-semibold text-gray-900 truncate max-w-[260px]"
              title={bookLabel || undefined}
            >
              {bookLabel || "—"}
            </span>

            {chapterLabelFinal ? (
              <span
                className="text-xs text-gray-600 bg-white/60 border border-gray-200 px-2 py-1 rounded-full mt-2 whitespace-nowrap"
                title={chapterLabelFinal}
              >
                {chapterLabelFinal}
              </span>
            ) : null}
          </div>

          {/* RIGHT: spacer (keeps layout balanced) */}
          <div className="flex items-center justify-end">
            <Badge className="bg-[#171717] text-white px-3 py-1 rounded-full text-sm">
              {statusAr}
            </Badge>
          </div>
        </div>

        {/* Body: Arabic text */}
        <div className="mt-4">
          <p
            className="text-2xl md:text-3xl font-arabic text-center text-gray-800 leading-relaxed select-text tracking-wide"
            dir="rtl"
            title={h.hadithArabic ?? h.text ?? h.hadithEnglish ?? ""}
          >
            {h.hadithArabic ?? h.text ?? h.hadithEnglish ?? ""}
          </p>
        </div>

        {/* optional heading */}
        {h.headingArabic ? (
          <div className="mt-3 text-center text-gray-500 text-sm" dir="rtl">
            {h.headingArabic}
          </div>
        ) : null}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => onDownload(idx)}
          className="px-3 py-1 rounded-full bg-gray-100 text-gray-900 text-sm hover:bg-gray-800 hover:text-white cursor-pointer transition-shadow shadow"
          style={{ direction: "ltr" }}
        >
          تحميل 
        </button>
      </div>
    </div>
  );
}
