"use client";
import { useState, useEffect } from "react";

// Available Quran Fonts
export const QURAN_FONTS = [
  { value: "amiri", label: "خط الأميري", family: "var(--font-amiri)" },
  { value: "warsh", label: "الورش المغربي", family: "var(--font-warsh-quran)" },
  {
    value: "elgharib",
    label: "الغريب حفص",
    family: "var(--font-elgharib-hafs)",
  },
  {
    value: "kfgqpc-warsh",
    label: "KFGQPC الورش",
    family: "var(--font-kfgqpc-warsh)",
  },
  {
    value: "kfgqpc-hafs",
    label: "KFGQPC العثماني",
    family: "var(--font-kfgqpc-hafs)",
  },
  { value: "lateef", label: "خط اللطيف", family: "Lateef" },
];

/**
 * Nettoie le texte arabe pour certaines polices qui ont des problèmes d'affichage
 * avec des marques diacritiques spécifiques
 * @param text - Le texte arabe à nettoyer
 * @param fontValue - La police sélectionnée
 * @returns Le texte nettoyé
 */
export function cleanArabicText(text: string, fontValue: string): string {
  // Pour les polices Elgharib HAFS et KFGQPC Hafs Uthmanic, on supprime le caractère ۟ (U+06DF)
  // qui cause des problèmes d'affichage (points noirs) sur certains mots comme فَيَكِيدُوا۟
  if (fontValue === "elgharib" || fontValue === "kfgqpc-hafs") {
    return text
      .replace(/\u06DF/g, "") // Supprime ۟ (Small High Rounded Zero / sukun sur alif)
      .replace(/\u0670/g, ""); // Supprime ٰ (Superscript Alef) si nécessaire
  }

  // Pour les autres polices, retourner le texte tel quel
  return text;
}

export function useQuranFont() {
  const [selectedFont, setSelectedFont] = useState<string>("amiri");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load font from localStorage on mount
  useEffect(() => {
    const savedFont = localStorage.getItem("quran-font");
    if (savedFont && QURAN_FONTS.some((f) => f.value === savedFont)) {
      setSelectedFont(savedFont);
    }
    setIsLoaded(true);
  }, []);

  // Save font to localStorage when changed
  const updateFont = (fontValue: string) => {
    if (QURAN_FONTS.some((f) => f.value === fontValue)) {
      setSelectedFont(fontValue);
      localStorage.setItem("quran-font", fontValue);
    }
  };

  const getFontFamily = () => {
    return (
      QURAN_FONTS.find((f) => f.value === selectedFont)?.family ||
      "var(--font-amiri)"
    );
  };

  const cleanText = (text: string) => {
    return cleanArabicText(text, selectedFont);
  };

  return {
    selectedFont,
    setSelectedFont: updateFont,
    getFontFamily,
    cleanText,
    fonts: QURAN_FONTS,
    isLoaded,
  };
}
