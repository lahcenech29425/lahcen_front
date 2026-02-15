"use client";
import React from "react";
import { normalizeServicesSection } from "./normalizer";
import type { ServicesSection } from "@/types/servicesSection";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function ServicesSection({ data }: { data: ServicesSection }) {
  const section = normalizeServicesSection(data);

  return (
    <section className="relative py-24 overflow-hidden bg-transparent">
      {/* Background patterns are now handled globally in globals.css */}

      {/* Subtle decorative glows */}
      <div className="absolute top-0 right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-20 w-80 h-80 bg-secondary/5 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6 text-foreground font-momken"
          >
            {section.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            {section.description}
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {section.services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="group"
            >
              <div className="h-full p-8 rounded-2xl bg-card border border-border hover:border-primary/50 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-2 flex flex-col">
                {/* Icon */}
                {service.icon && (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Image
                      src={service.icon.url}
                      alt={service.icon.alternativeText || service.title}
                      width={32}
                      height={32}
                      className="w-8 h-8 object-contain group-hover:scale-110 transition-transform dark:brightness-0 dark:invert"
                      loading="lazy"
                    />
                  </div>
                )}

                <h3 className="text-xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">
                  {service.title}
                </h3>

                <p className="text-muted-foreground mb-6 flex-1 leading-relaxed">
                  {service.description}
                </p>

                <Link
                  href={service.link}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
                >
                  <span>اقرأ المزيد</span>
                  <ArrowLeft size={16} className="transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
