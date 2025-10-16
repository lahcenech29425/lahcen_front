"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type ImageType = {
  url: string;
  alternativeText?: string;
  surahId?: number | string;
  ayahNumber?: number | string;
  hadithId?: number | string;
  link?: string;
};

export default function ImageCard({
  image,
  href,
  fetchType,
}: {
  image: ImageType;
  href?: string | null;
  fetchType?: "quran" | "hadith";
}) {
  const [caption, setCaption] = useState<string | null>(null);

  // Local data (use this instead of network)
  const LOCAL = {
    ayat: [
      { texte: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", reference: "الشرح: 6" },
      {
        texte: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ",
        reference: "النور: 35",
      },
      { texte: "وَقُلْ رَبِّ زِدْنِي عِلْمًا", reference: "طه: 114" },
      { texte: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", reference: "الشرح: 5" },
      { texte: "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ", reference: "هود: 88" },
    ],
    hadith: [
      {
        texte: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ",
        reference: "البخاري ومسلم",
      },
      {
        texte:
          "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
        reference: "البخاري ومسلم",
      },
      { texte: "مَنْ لاَ يَرْحَمْ لاَ يُرْحَمْ", reference: "البخاري" },
      { texte: "الدِّينُ يُسْرٌ", reference: "البخاري" },
      {
        texte: "خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ",
        reference: "الطبراني",
      },
    ],
  };

  useEffect(() => {
    // pick random local entry depending on fetchType
    if (fetchType === "quran") {
      const pick = LOCAL.ayat[Math.floor(Math.random() * LOCAL.ayat.length)];
      // use newline and render with CSS "whitespace-pre-line" so it becomes a <br>
      setCaption(`${pick.texte}\n${pick.reference}`);
      return;
    }
    if (fetchType === "hadith") {
      const pick =
        LOCAL.hadith[Math.floor(Math.random() * LOCAL.hadith.length)];
      setCaption(`${pick.texte}\n${pick.reference}`);
      return;
    }
    // fallback: use alternativeText
    setCaption(image.alternativeText ?? null);
  }, [image.url, fetchType, LOCAL.ayat, LOCAL.hadith, image.alternativeText]);

  const truncate = (s: string, n: number) =>
    s.length > n ? s.slice(0, n - 1) + "…" : s;

  // overlay: darker on hover (desktop); always visible (no 'small' mode)
  const overlayClass =
    "absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/70 text-white text-base font-semibold p-3 text-center transition-colors duration-200";

  const content = (
    <div
      className={`bg-white rounded-xl shadow-md transition border border-gray-100 flex flex-col h-full overflow-hidden group`}
    >
      <div
        // smaller on mobile, normal on sm+ (adjust as needed)
        className={`relative w-full h-56 sm:h-72 bg-gray-100 overflow-hidden`}
      >
        <Image
          src={image.url}
          alt={image.alternativeText || "Image"}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 280px, (max-width: 1024px) 100vw, 33vw"
          priority={false}
        />

        <div className={overlayClass} aria-hidden>
          {caption ? (
            // "whitespace-pre-line" renders "\n" as line break
            <div className="px-2 text-sm sm:text-base whitespace-pre-line transition-opacity duration-200">
              {truncate(caption, 140)}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );

  const destination = href ?? image.link ?? "#";

  if (!destination || destination === "#") {
    return content;
  }

  return (
    <Link
      href={destination}
      className="block"
      aria-label={image.alternativeText || "link"}
    >
      {content}
    </Link>
  );
}
