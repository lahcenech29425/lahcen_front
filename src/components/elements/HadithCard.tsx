import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
import React, { MutableRefObject } from "react";
import type { Hadith } from "@/types/Hadith";

type HadithCardProps = {
  hadith: Hadith;
  idx: number;
  cardRefs: MutableRefObject<(HTMLDivElement | null)[]>;
  onDownload: (idx: number) => void;
};

export function HadithCard({
  hadith,
  idx,
  cardRefs,
  onDownload,
}: HadithCardProps) {
  const { ref: fadeRef, visible } = useScrollFadeIn<HTMLDivElement>();

  // Combine refs
  const setRefs = (el: HTMLDivElement | null) => {
    cardRefs.current[idx] = el;
    if (fadeRef) {
      // Au lieu de (fadeRef as any).current = el, on utilise un cast plus précis:
      (fadeRef as MutableRefObject<HTMLDivElement | null>).current = el;
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <div
        ref={setRefs}
        className={`rounded-xl shadow-md px-6 py-8 flex flex-col items-center group transition hover:shadow-lg animate-scroll-fade${
          visible ? " visible" : ""
        }`}
        style={{
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
          border: "1px solid #dee2e6",
        }}
      >
        <span className="mb-4 text-xs text-gray-500 font-semibold">
          رقم الحديث: {hadith.number}
        </span>
        <div className="text-2xl md:text-3xl font-arabic text-center text-gray-700 leading-loose select-text tracking-wide mb-4">
          {hadith.text}
        </div>
        {hadith.heading && (
          <div className="text-gray-500 text-sm mb-2">{hadith.heading}</div>
        )}
      </div>
      <button
        onClick={() => onDownload(idx)}
        className="mb-2 px-4 py-1 rounded bg-gray-800 text-white text-sm hover:bg-gray-900 transition shadow"
        style={{ direction: "ltr" }}
      >
        تحميل كصورة
      </button>
    </div>
  );
}
