import React from "react";
import Image from "next/image";

export default function SliderModal({
  images,
  selected,
  onClose,
  onPrev,
  onNext,
}: {
  images: { url: string; alternativeText?: string }[];
  selected: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* Arrière-plan flou */}
    <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
    />
    {/* Popup centré */}
      <div className="relative z-10 max-w-2xl w-full mx-4 bg-white rounded-xl shadow-xl flex flex-col items-center p-6">
        <button
          className="absolute top-4 right-6 text-gray-700 text-3xl font-bold"
          onClick={onClose}
          aria-label="Fermer"
        >
          ×
        </button>
        <div className="flex items-center justify-between w-full">
          <button
            className="text-gray-700 text-4xl px-2"
            onClick={onPrev}
            aria-label="Précédent"
            disabled={selected === 0}
          >
            ‹
          </button>
          <div className="flex-1 flex items-center justify-center">
            <Image
              src={images[selected].url}
              alt={images[selected].alternativeText || ""}
              width={600}
              height={400}
              className="rounded-xl object-contain bg-white"
              loading="lazy"
            />
          </div>
          <button
            className="text-gray-700 text-4xl px-2"
            onClick={onNext}
            aria-label="Suivant"
            disabled={selected === images.length - 1}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}