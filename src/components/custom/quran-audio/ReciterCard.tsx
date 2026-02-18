"use client";
import { Link } from "@/components/elements/Link";
import type { Mp3QuranReciter } from "@/types/quranAudio";
import { Headphones, Play } from "lucide-react";
import { motion } from "framer-motion";

interface ReciterCardProps {
  reciter: Mp3QuranReciter;
  delay?: number;
}

/** First Arabic letter for the avatar. */
function getInitials(name: string): string {
  return name.charAt(0) ?? "";
}

export default function ReciterCard({ reciter, delay = 0 }: ReciterCardProps) {
  const initials = getInitials(reciter.name);
  const firstMoshaf = reciter.moshaf[0];
  const totalSurahs = firstMoshaf?.surah_total ?? 0;
  const moshafName = firstMoshaf?.name ?? "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.35 }}
    >
      <Link href={`/quran-audio/${reciter.id}`} className="group block">
        <div className="bg-card rounded-3xl border border-border shadow-md hover:shadow-xl hover:border-primary transition-all duration-300 overflow-hidden">
          <div className="p-5 pb-4">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative w-14 h-14 rounded-2xl bg-linear-to-br from-[#8B4513] to-[#5d3119] flex items-center justify-center shadow-lg shadow-primary/15 group-hover:scale-105 transition-transform duration-300 shrink-0">
                <span className="text-white text-lg font-bold font-momken">
                  {initials}
                </span>
                {/* Play overlay */}
                <div className="absolute inset-0 rounded-2xl bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Play className="w-5 h-5 text-white fill-white" />
                </div>
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-foreground truncate group-hover:text-primary transition-colors duration-200">
                  {reciter.name}
                </h3>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {moshafName}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 pb-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/8 text-primary border border-primary/10">
                <Headphones size={11} />
                {totalSurahs} سورة
              </span>

              {reciter.moshaf.length > 1 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground">
                  {reciter.moshaf.length} روايات
                </span>
              )}

              <span className="text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                استمع
                <svg
                  className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
