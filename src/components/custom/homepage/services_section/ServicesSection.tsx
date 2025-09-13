"use client";
import { normalizeServicesSection } from "./normalizer";
import type { ServicesSection } from "@/types/servicesSection";
import Link from "next/link";
import Image from "next/image";

export default function ServicesSection({ data }: { data: ServicesSection }) {
  const section = normalizeServicesSection(data);
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">{section.title}</h2>
          <p className="text-gray-600 text-lg">{section.description}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {section.services.map((service) => (
            <div
              key={service.id}
              className="bg-gray-50 rounded-xl p-6 flex flex-col items-start"
            >
              {service.icon && (
                <div className="bg-primary/10 rounded-full p-4 mb-4 flex items-center justify-center hover:bg-primary/20 transition">
                  <Image
                    src={service.icon.url}
                    alt={service.icon.alternativeText || service.title}
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain"
                  />
                </div>
              )}
              <h3 className="text-lg font-semibold mb-2 text-gray-900">{service.title}</h3>
              <p className="text-gray-600 mb-4 flex-1">{service.description}</p>
              <Link
                href={service.link}
                className="text-primary font-semibold hover:underline mt-auto"
              >
                Learn more &rarr;
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}