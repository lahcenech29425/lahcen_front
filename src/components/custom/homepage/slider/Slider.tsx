"use client";
import React, { useState, useEffect } from "react";
import { normalizeSlider } from "./normalizer";
import { Slider as SliderType } from "@/types/slider";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function Slider({ data }: { data: SliderType }) {
  const slider = normalizeSlider(data);
  const [activeIdx, setActiveIdx] = useState(0);
  const slides = slider.slider.filter((item) => item.image?.url);

  // Reversé pour le RTL: PREV diminue l'index, NEXT augmente l'index
  const handlePrev = () =>
    setActiveIdx((idx) => (idx === 0 ? slides.length - 1 : idx - 1));
  const handleNext = () =>
    setActiveIdx((idx) => (idx === slides.length - 1 ? 0 : idx + 1));

  useEffect(() => {
    if (!slider.timer || slides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIdx((idx) => (idx === slides.length - 1 ? 0 : idx + 1));
    }, slider.timer * 1000);
    return () => clearInterval(interval);
  }, [slider.timer, slides.length]);

  return (
    <section className="section-spacing relative overflow-hidden bg-transparent pb-24">
      {/* Background patterns are now handled globally in globals.css */}

      {/* Decorative glows */}
      <div className="absolute top-20 right-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground font-momken">
            {slider.title}
          </h2>
          {slider.description && (
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              {slider.description}
            </p>
          )}
        </div>

        {/* Slider */}
        <div className="relative">
          <div className="relative h-[450px] md:h-[600px] overflow-hidden rounded-[32px] shadow-2xl border-2 border-white dark:border-border ring-1 ring-gray-200 dark:ring-border">
            {slides.map((item, idx) => (
              <div
                key={item.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  activeIdx === idx
                    ? "opacity-100 scale-100 z-10"
                    : "opacity-0 scale-110 z-0"
                }`}
              >
                <Image
                  src={item.image.url}
                  alt={item.image.alt || item.title}
                  fill
                  className="object-cover"
                  loading={idx === 0 ? "eager" : "lazy"}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2c1810]/90 via-[#2c1810]/30 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14 text-center md:text-right">
                  <h3 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg font-momken leading-tight">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="text-lg md:text-xl text-white/90 max-w-3xl md:ml-auto leading-relaxed font-medium">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Navigation Arrows - Reversed for RTL */}
            {/* Left Button (Next in RTL) */}
            <button
              className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-lg hover:bg-primary hover:border-primary hover:scale-110 transition-all duration-300 z-20 group"
              onClick={handlePrev}
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
            </button>

            {/* Right Button (Prev in RTL) */}
            <button
              className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-lg hover:bg-primary hover:border-primary hover:scale-110 transition-all duration-300 z-20 group"
              onClick={handleNext}
              aria-label="Next slide"
            >
              <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Dots Indicators */}
          <div className="flex justify-center gap-3 mt-10 z-20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                className={`transition-all duration-500 rounded-full h-2.5 ${
                  activeIdx === idx
                    ? "w-12 bg-primary shadow-lg shadow-primary/30"
                    : "w-2.5 bg-gray-300 dark:bg-border hover:bg-primary/50"
                }`}
                onClick={() => setActiveIdx(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Thumbnails */}
          {slider.allow_thumbnail && (
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
              {slides.map((item, idx) => (
                <button
                  key={item.id}
                  className={`relative h-24 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${
                    activeIdx === idx
                      ? "ring-4 ring-primary shadow-xl"
                      : "ring-1 ring-gray-200 dark:ring-border opacity-70 hover:opacity-100"
                  }`}
                  onClick={() => setActiveIdx(idx)}
                >
                  <Image
                    src={item.image.url}
                    alt={item.image.alt || item.title}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                  <div
                    className={`absolute inset-0 bg-primary/20 transition-opacity ${activeIdx === idx ? "opacity-0" : "opacity-100"}`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
