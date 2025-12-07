"use client";
import { normalizeServicesSection } from "./normalizer";
import type { ServicesSection } from "@/types/servicesSection";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function ServicesSection({ data }: { data: ServicesSection }) {
  const section = normalizeServicesSection(data);
  return (
    <section className="py-16 bg-white dark:bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-primary dark:text-primary-light mb-2">
            {section.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            {section.description}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {section.services.map((service) => (
            <div
              key={service.id}
              className="bg-gray-50 dark:bg-[#232323] rounded-xl p-6 flex flex-col items-start"
            >
              {service.icon && (
                <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-4 mb-4 flex items-center justify-center hover:bg-primary/20 dark:hover:bg-primary/30 transition">
                  <Image
                    src={service.icon.url}
                    alt={service.icon.alternativeText || service.title}
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain dark:invert"
                    loading="lazy"
                  />
                </div>
              )}
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                {service.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1">
                {service.description}
              </p>
              <Link
                href={service.link}
                className="group inline-flex items-center gap-1.5 text-gray-700 dark:text-gray-200 font-medium hover:text-gray-900 dark:hover:text-white transition-colors mt-auto"
              >
                <span>اقرأ المزيد</span>
                <ArrowLeft
                  size={14}
                  className="relative top-[1px] transition-transform group-hover:translate-x-[-2px]"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
