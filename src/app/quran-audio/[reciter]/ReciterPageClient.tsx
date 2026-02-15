"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import Breadcrumb from "@/components/elements/Breadcrumb";
import { SurahAudioEdition } from "@/types/quranAudio";
import { SURAHS_LIST, SurahInfo } from "@/data/surahs";
import { getSurahAudioUrl } from "@/utils/quranAudioApi";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Search,
  Music,
  Headphones,
  X,
  BookOpen,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────

interface ReciterPageClientProps {
  edition: SurahAudioEdition;
}

// ─── Helpers ────────────────────────────────────────────

/** Format seconds → "m:ss" */
function formatTime(time: number): string {
  if (isNaN(time)) return "0:00";
  const m = Math.floor(time / 60);
  const s = Math.floor(time % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Extract first letter from Arabic name for avatar */
function getInitials(name: string): string {
  return name.charAt(0) ?? "";
}

// ─── Component ──────────────────────────────────────────

export default function ReciterPageClient({ edition }: ReciterPageClientProps) {
  const [search, setSearch] = useState("");

  // Audio player state
  const [currentSurah, setCurrentSurah] = useState<SurahInfo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  // ── Derived data ──────────────────────────────────────

  const filteredSurahs = useMemo(() => {
    if (!search.trim()) return SURAHS_LIST;
    const q = search.toLowerCase().trim();
    return SURAHS_LIST.filter(
      (s) =>
        s.name.includes(search) ||
        s.englishName.toLowerCase().includes(q) ||
        s.number.toString() === q,
    );
  }, [search]);

  // ── Audio actions ─────────────────────────────────────

  const playSurah = useCallback(
    (surah: SurahInfo) => {
      setCurrentSurah(surah);
      setShowPlayer(true);
      setIsPlaying(true);

      if (audioRef.current) {
        audioRef.current.src = getSurahAudioUrl(edition.id, surah.number);
        audioRef.current.play().catch(console.error);
      }
    },
    [edition.id],
  );

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying((p) => !p);
  }, [isPlaying]);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const t = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = t;
      setCurrentTime(t);
    }
  }, []);

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = parseFloat(e.target.value);
      setVolume(v);
      if (audioRef.current) audioRef.current.volume = v;
      setIsMuted(v === 0);
    },
    [],
  );

  const toggleMute = useCallback(() => {
    if (audioRef.current) audioRef.current.muted = !isMuted;
    setIsMuted((m) => !m);
  }, [isMuted]);

  const skipPrevious = useCallback(() => {
    if (currentSurah && currentSurah.number > 1) {
      const prev = SURAHS_LIST.find(
        (s) => s.number === currentSurah.number - 1,
      );
      if (prev) playSurah(prev);
    }
  }, [currentSurah, playSurah]);

  const skipNext = useCallback(() => {
    if (currentSurah && currentSurah.number < 114) {
      const next = SURAHS_LIST.find(
        (s) => s.number === currentSurah.number + 1,
      );
      if (next) playSurah(next);
    }
  }, [currentSurah, playSurah]);

  const closePlayer = useCallback(() => {
    if (audioRef.current) audioRef.current.pause();
    setShowPlayer(false);
    setIsPlaying(false);
    setCurrentSurah(null);
  }, []);

  // Audio element handlers
  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleEnded = () => {
    if (currentSurah && currentSurah.number < 114) {
      const next = SURAHS_LIST.find(
        (s) => s.number === currentSurah.number + 1,
      );
      if (next) {
        playSurah(next);
        return;
      }
    }
    setIsPlaying(false);
  };

  // ── Render ────────────────────────────────────────────

  return (
    <>
      {/* ── Hero Section ─────────────────────────────── */}
      <div
        className="relative w-full h-112.5 md:h-137.5 overflow-hidden"
        dir="rtl"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/quran-audio-header.png')" }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Breadcrumb */}
        <div className="absolute top-0 left-0 right-0 z-20 pt-32">
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-start">
            <div className="bg-black/20 backdrop-blur-sm inline-block px-4 py-2 rounded-lg border border-white/10">
              <Breadcrumb
                items={[
                  { label: "الاستماع للقرآن", href: "/quran-audio" },
                  { label: edition.arabicName },
                ]}
                textColor="text-white"
                showHomeLabel={false}
                className="mb-0!"
              />
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-center md:justify-start gap-8 px-4 z-10 pt-24 max-w-7xl mx-auto md:px-8">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-2xl shrink-0"
          >
            <span className="text-white text-4xl md:text-5xl font-bold font-momken">
              {getInitials(edition.arabicName)}
            </span>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-center md:text-right"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-momken text-white mb-3">
              {edition.arabicName}
            </h1>
            <p className="text-lg text-white/80 mb-4">{edition.englishName}</p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              {edition.style && (
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-white/10 text-white backdrop-blur-sm border border-white/10">
                  <Headphones size={18} />
                  {edition.style}
                </span>
              )}
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-white/10 text-white backdrop-blur-sm border border-white/10">
                <Music size={18} />
                114 سورة
              </span>
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-white/10 text-white backdrop-blur-sm border border-white/10">
                <BookOpen size={18} />
                القرآن الكريم
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Main Content ───────────────────────────────── */}
      <section className="py-12 bg-background transition-colors">
        <div className="max-w-7xl mx-auto px-4 md:px-8" dir="rtl">
          {/* Search bar */}
          <div className="sticky top-20 z-30 bg-white/60 dark:bg-white/5 backdrop-blur-2xl rounded-3xl shadow-xl border border-primary/10 p-6 mb-8 -mt-16">
            <div className="relative max-w-md mx-auto">
              <Search
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B4513]/50"
                size={20}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث عن سورة..."
                className="w-full rounded-2xl bg-white/80 dark:bg-white/10 text-foreground pr-12 pl-4 py-3 border border-primary/10 focus:ring-2 focus:ring-[#8B4513]/30 focus:border-[#8B4513]/40 focus:outline-none transition shadow-sm"
                dir="rtl"
              />
            </div>
          </div>

          {/* Surahs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSurahs.map((surah, idx) => {
              const isActive = currentSurah?.number === surah.number;
              return (
                <motion.button
                  key={surah.number}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: Math.min(idx * 0.015, 0.6),
                  }}
                  onClick={() => playSurah(surah)}
                  className={`group text-right rounded-3xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 border ${
                    isActive
                      ? "bg-linear-to-br from-[#8B4513]/10 to-[#5d3119]/5 border-[#8B4513]/30 shadow-[#8B4513]/10"
                      : "bg-card border-primary/10 hover:border-[#8B4513]/25"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Surah Number */}
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold transition-colors ${
                        isActive
                          ? "bg-linear-to-br from-[#8B4513] to-[#5d3119] text-white"
                          : "bg-[#8B4513]/8 text-[#8B4513] dark:text-[#d4a574] group-hover:bg-[#8B4513]/15"
                      }`}
                    >
                      {surah.number}
                    </div>

                    {/* Surah Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground truncate">
                        {surah.name}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {surah.englishName} • {surah.numberOfAyahs} آية
                      </p>
                    </div>

                    {/* Play Icon */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isActive && isPlaying
                          ? "bg-linear-to-br from-[#8B4513] to-[#5d3119] shadow-lg shadow-[#8B4513]/25"
                          : "bg-[#8B4513]/8 group-hover:bg-linear-to-br group-hover:from-[#8B4513] group-hover:to-[#5d3119]"
                      }`}
                    >
                      {isActive && isPlaying ? (
                        <Pause className="w-5 h-5 text-white" />
                      ) : (
                        <Play className="w-5 h-5 text-[#8B4513] dark:text-[#d4a574] group-hover:text-white" />
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredSurahs.length === 0 && (
            <div className="text-center py-20">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">لم يتم العثور على سور</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Fixed Audio Player ────────────────────────── */}
      {showPlayer && currentSurah && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-card/90 backdrop-blur-2xl border-t border-[#8B4513]/10 shadow-2xl z-50"
        >
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              {/* Current Surah Info */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#8B4513] to-[#5d3119] flex items-center justify-center text-white font-bold shrink-0">
                  {currentSurah.number}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-foreground truncate" dir="rtl">
                    {currentSurah.name}
                  </h4>
                  <p
                    className="text-sm text-muted-foreground truncate"
                    dir="rtl"
                  >
                    {edition.arabicName}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={skipPrevious}
                  className="p-2 rounded-full hover:bg-[#8B4513]/10 transition"
                  disabled={currentSurah.number <= 1}
                >
                  <SkipForward className="w-5 h-5 text-muted-foreground" />
                </button>

                <button
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-linear-to-br from-[#8B4513] to-[#5d3119] hover:opacity-90 flex items-center justify-center transition-all shadow-lg shadow-[#8B4513]/25"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white -mr-0.5" />
                  )}
                </button>

                <button
                  onClick={skipNext}
                  className="p-2 rounded-full hover:bg-[#8B4513]/10 transition"
                  disabled={currentSurah.number >= 114}
                >
                  <SkipBack className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="flex-1 flex items-center gap-3 max-w-md">
                <span className="text-xs text-muted-foreground w-10 text-left">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 h-1.5 bg-[#8B4513]/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#8B4513]"
                />
                <span className="text-xs text-muted-foreground w-10">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Volume & Close */}
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-full hover:bg-[#8B4513]/10 transition"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1.5 bg-[#8B4513]/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#8B4513]"
                />
                <button
                  onClick={closePlayer}
                  className="p-2 rounded-full hover:bg-[#8B4513]/10 transition mr-2"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Bottom padding when player is visible */}
      {showPlayer && <div className="h-24 md:h-20" />}
    </>
  );
}
