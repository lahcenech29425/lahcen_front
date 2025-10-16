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
      { texte: "وَقُل رَّبِّ زِدْنِي عِلْمًا", reference: "طه: 114" },
      { texte: "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ", reference: "هود: 88" },
      {
        texte: "وَاعْبُدُوا اللَّهَ وَلَا تُشْرِكُوا بِهِ شَيْئًا",
        reference: "النساء: 36",
      },
      {
        texte: "وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ",
        reference: "الأنبياء: 107",
      },
      { texte: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", reference: "البقرة: 153" },
      { texte: "فَاذْكُرُونِي أَذْكُرْكُمْ", reference: "البقرة: 152" },
      {
        texte: "وَجَعَلْنَا مِنَ الْمَاءِ كُلَّ شَيْءٍ حَيٍّ",
        reference: "الأنبياء: 30",
      },
      {
        texte: "وَتَوَكَّلْ عَلَى اللَّهِ وَكَفَى بِاللَّهِ وَكِيلًا",
        reference: "آل عمران: 159",
      },
      { texte: "قُلْ هُوَ اللَّهُ أَحَدٌ", reference: "الإخلاص: 1" },
      { texte: "إِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ", reference: "النساء: 96" },
      {
        texte: "يَا أَيُّهَا الَّذِينَ آمَنُوا اصْبِرُوا وَصَابِرُوا",
        reference: "آل عمران: 200",
      },
      {
        texte: "وَاتَّقُوا اللَّهَ وَيُعَلِّمُكُمُ اللَّهُ",
        reference: "البقرة: 282",
      },
      { texte: "وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ", reference: "يوسف: 87" },
      {
        texte: "إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالإِحْسَانِ",
        reference: "النحل: 90",
      },
      { texte: "فَاسْتَقِمْ كَمَا أُمِرْتَ", reference: "هود: 112" },
      {
        texte: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
        reference: "الطلاق: 2",
      },
      {
        texte: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ",
        reference: "البقرة: 186",
      },
      {
        texte: "إِنَّ الصَّلاةَ تَنْهَى عَنِ الْفَحْشَاءِ وَالْمُنْكَرِ",
        reference: "العنكبوت: 45",
      },
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
      {
        texte: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ",
        reference: "الترمذي",
      },
      {
        texte: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِن لِسَانِهِ وَيَدِهِ",
        reference: "البخاري ومسلم",
      },
      { texte: "إِنَّ اللَّهَ جَمِيلٌ يُحِبُّ الْجَمَالَ", reference: "مسلم" },
      {
        texte: "أَكْمَلُ الْمُؤْمِنِينَ إِيمَانًا أَحْسَنُهُمْ خُلُقًا",
        reference: "الترمذي",
      },
      { texte: "رَاحِمُوا تُرْحَمُوا", reference: "البخاري ومسلم" },
      {
        texte: "الْجَنَّةُ تَحْتَ أَقْدَامِ الأُمَّهَاتِ",
        reference: "النسائي",
      },
      {
        texte: "مَن كان يؤمن بالله واليوم الآخر فليقل خيرًا أو ليصمت",
        reference: "البخاري ومسلم",
      },
      {
        texte:
          "إن الله لا ينظر إلى صوركم وأموالكم ولكن ينظر إلى قلوبكم وأعمالكم",
        reference: "مسلم",
      },
      { texte: "الحياء شعبة من الإيمان", reference: "البخاري ومسلم" },
      { texte: "الدنيا مزرعة الآخرة", reference: "مسلم" },
      {
        texte: "إنما مثل الذي يذكر ربه والذي لا يذكره مثل الحي والميت",
        reference: "البخاري",
      },
      { texte: "التواضع لا يزيد العبد إلا عزًا", reference: "مسلم" },
      { texte: "الصبر ضياء", reference: "الترمذي" },
      { texte: "من حسن إسلام المرء تركه ما لا يعنيه", reference: "الترمذي" },
      {
        texte: "الرفق لا يكون في شيء إلا زانه ولا ينزع من شيء إلا شانه",
        reference: "مسلم",
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
