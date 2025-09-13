import React, { useState, useEffect } from "react";
import { normalizeSlider } from "./normalizer";
import { Slider as SliderType } from "@/types/slider";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Slider({ data }: { data: SliderType }) {
  const slider = normalizeSlider(data);
  const [activeIdx, setActiveIdx] = useState(0);
  const slides = slider.slider;

  const handlePrev = () =>
    setActiveIdx((idx) => (idx === 0 ? slides.length - 1 : idx - 1));
  const handleNext = () =>
    setActiveIdx((idx) => (idx === slides.length - 1 ? 0 : idx + 1));

  // Auto slide with timer
  useEffect(() => {
    if (!slider.timer || slides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIdx((idx) => (idx === slides.length - 1 ? 0 : idx + 1));
    }, slider.timer * 1000);
    return () => clearInterval(interval);
  }, [slider.timer, slides.length]);

  return (
    <section className="w-full py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">{slider.title}</h2>
          {slider.description && (
            <p className="mt-4 text-lg text-gray-600">{slider.description}</p>
          )}
        </div>
        <div className="mt-12">
          <div className="relative">
            <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-xl">
              {slides.map((item, idx) => (
                <div
                  key={item.id}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    activeIdx === idx ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                >
                  <Image
                    src={item.image.url}
                    alt={item.image.alt || item.title}
                    fill
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-8">
                    <h3 className="text-xl font-medium text-white">
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p className="mt-2 text-sm text-gray-200">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow-lg hover:bg-white transition-colors z-20"
                style={{ pointerEvents: "auto" }}
                onClick={handlePrev}
                aria-label="Slide précédente"
              >
                <ChevronLeft
                  className="w-6 h-6 text-gray-800"
                  strokeWidth={1.5}
                />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow-lg hover:bg-white transition-colors z-20"
                style={{ pointerEvents: "auto" }}
                onClick={handleNext}
                aria-label="Slide suivante"
              >
                <ChevronRight
                  className="w-6 h-6 text-gray-800"
                  strokeWidth={1.5}
                />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      activeIdx === idx
                        ? "bg-white"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                    onClick={() => setActiveIdx(idx)}
                    aria-label={`Image ${idx + 1}`}
                  >
                    <span className="sr-only">Image {idx + 1}</span>
                  </button>
                ))}
              </div>
            </div>
            {/* Thumbnails */}
            {slider.allow_thumbnail && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {slides.map((item, idx) => (
                  <button
                    key={item.id}
                    className={`relative rounded-lg overflow-hidden group ring-2 ${
                      activeIdx === idx ? "ring-gray-600" : "ring-transparent"
                    }`}
                    onClick={() => setActiveIdx(idx)}
                  >
                    <Image
                      src={item.image.url}
                      alt={item.image.alt || item.title}
                      width={300}
                      height={100}
                      className="w-full h-24 object-cover"
                    />
                    <div
                      className={`absolute inset-0 bg-black transition-opacity ${
                        activeIdx === idx
                          ? "opacity-0"
                          : "opacity-50 group-hover:opacity-30"
                      }`}
                    ></div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
