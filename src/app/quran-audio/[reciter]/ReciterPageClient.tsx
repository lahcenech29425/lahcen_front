"use client";

import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageHero from "@/components/blocks/hero/PageHero";
import Pagination from "@/components/elements/Pagination";
import type { Mp3QuranReciter, Mp3QuranMoshaf } from "@/types/quranAudio";
import { SURAHS_LIST, SurahInfo } from "@/data/surahs";
import { getSurahAudioUrl, parseSurahList } from "@/utils/quranAudioApi";
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
  Maximize2,
  Minimize2,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────

interface ReciterPageClientProps {
  reciter: Mp3QuranReciter;
}

// ─── Helpers ────────────────────────────────────────────

function SoundWave({ isPlaying }: { isPlaying: boolean }) {
  const bars = [0.4, 0.7, 1.0, 0.6, 0.9, 0.5, 0.8, 0.3, 0.7, 0.9, 0.5, 0.6, 0.4, 0.8, 0.7, 0.5];
  return (
    <div className="flex items-center justify-center gap-[3px] h-16">
      {bars.map((maxH, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full"
          style={{ background: "rgba(255,255,255,0.5)" }}
          animate={isPlaying ? {
            height: ["4px", `${maxH * 48}px`, "4px"],
            opacity: [0.4, 0.9, 0.4],
          } : {
            height: "4px",
            opacity: 0.3,
          }}
          transition={isPlaying ? {
            duration: 0.6 + i * 0.07,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.04,
          } : { duration: 0.3 }}
        />
      ))}
    </div>
  );
}

/** Format seconds → "m:ss" */
function formatTime(time: number): string {
  if (isNaN(time)) return "0:00";
  const m = Math.floor(time / 60);
  const s = Math.floor(time % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Extract first letter from Arabic name for avatar */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].charAt(0);
  // For Arabic names, usually first and last are good, 
  // but if it's "مشاري راشد العفاسي", MRA or MA
  return parts.map(p => p.charAt(0)).join("").substring(0, 2);
}

// ─── Component ──────────────────────────────────────────

export default function ReciterPageClient({ reciter }: ReciterPageClientProps) {
  const [search, setSearch] = useState("");
  const [selectedMoshafIndex, setSelectedMoshafIndex] = useState(0);

  // Audio player state
  const [currentSurah, setCurrentSurah] = useState<SurahInfo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFsControls, setShowFsControls] = useState(true);
  const fsHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);

  // ── Derived data ──────────────────────────────────────

  const currentMoshaf: Mp3QuranMoshaf = reciter.moshaf[selectedMoshafIndex] ?? reciter.moshaf[0];
  const availableSurahNumbers = useMemo(
    () => new Set(parseSurahList(currentMoshaf.surah_list)),
    [currentMoshaf.surah_list],
  );

  /** Only show surahs that are available in this moshaf */
  const availableSurahs = useMemo(
    () => SURAHS_LIST.filter((s) => availableSurahNumbers.has(s.number)),
    [availableSurahNumbers],
  );

  const filteredSurahs = useMemo(() => {
    if (!search.trim()) return availableSurahs;
    const q = search.toLowerCase().trim();
    return availableSurahs.filter(
      (s) =>
        s.name.includes(search) ||
        s.englishName.toLowerCase().includes(q) ||
        s.number.toString() === q,
    );
  }, [search, availableSurahs]);

  // Pagination
  const PAGE_SIZE = 15;
  const [page, setPage] = useState(1);
  const pagedSurahs = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredSurahs.slice(start, start + PAGE_SIZE);
  }, [filteredSurahs, page]);
  const pageCount = Math.ceil(filteredSurahs.length / PAGE_SIZE);

  // Reset page when search or filters change
  useEffect(() => {
    setPage(1);
  }, [search, selectedMoshafIndex]);

  // ── Audio actions ─────────────────────────────────────

  const playSurah = useCallback(
    (surah: SurahInfo) => {
      setCurrentSurah(surah);
      setShowPlayer(true);
      setIsPlaying(true);

      if (audioRef.current) {
        audioRef.current.src = getSurahAudioUrl(currentMoshaf.server, surah.number);
        audioRef.current.play().catch(console.error);
      }
    },
    [currentMoshaf.server],
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
    if (!currentSurah) return;
    const currentIdx = availableSurahs.findIndex((s) => s.number === currentSurah.number);
    if (currentIdx > 0) {
      playSurah(availableSurahs[currentIdx - 1]);
    }
  }, [currentSurah, availableSurahs, playSurah]);

  const skipNext = useCallback(() => {
    if (!currentSurah) return;
    const currentIdx = availableSurahs.findIndex((s) => s.number === currentSurah.number);
    if (currentIdx < availableSurahs.length - 1) {
      playSurah(availableSurahs[currentIdx + 1]);
    }
  }, [currentSurah, availableSurahs, playSurah]);

  const closePlayer = useCallback(() => {
    if (audioRef.current) audioRef.current.pause();
    setShowPlayer(false);
    setIsFullscreen(false);
    setIsPlaying(false);
    setCurrentSurah(null);
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((f) => !f);
  }, []);

  // Auto-hide controls in fullscreen on mouse inactivity
  const handleFsMouseMove = useCallback(() => {
    setShowFsControls(true);
    if (fsHideTimer.current) clearTimeout(fsHideTimer.current);
    fsHideTimer.current = setTimeout(() => setShowFsControls(false), 3000);
  }, []);

  // Cleanup timer on unmount / fullscreen exit
  useEffect(() => {
    if (!isFullscreen) {
      setShowFsControls(true);
      if (fsHideTimer.current) clearTimeout(fsHideTimer.current);
    }
    return () => { if (fsHideTimer.current) clearTimeout(fsHideTimer.current); };
  }, [isFullscreen]);

  // Toggle body class for fullscreen player
  useEffect(() => {
    if (isFullscreen) {
      document.documentElement.classList.add("player-fullscreen");
    } else {
      document.documentElement.classList.remove("player-fullscreen");
    }
    return () => document.documentElement.classList.remove("player-fullscreen");
  }, [isFullscreen]);

  // Audio element handlers
  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleEnded = () => {
    if (!currentSurah) {
      setIsPlaying(false);
      return;
    }
    const currentIdx = availableSurahs.findIndex((s) => s.number === currentSurah.number);
    if (currentIdx < availableSurahs.length - 1) {
      playSurah(availableSurahs[currentIdx + 1]);
    } else {
      setIsPlaying(false);
    }
  };

  // ── Render ────────────────────────────────────────────

  return (
    <>
      {/* ── Hero Section ─────────────────────────────── */}
      <PageHero
        backgroundImage={`${process.env.NEXT_PUBLIC_CLOUDINARY_ROOT}/image/upload/v1771248764/quran-audio-header_tqedwh.png`}
        breadcrumbs={[
          { label: "الاستماع للقرآن", href: "/quran-audio" },
          { label: reciter.name },
        ]}
        heightClass="h-[520px] md:h-[600px]"
        dir="rtl"
      >
        {/* Avatar + Info — left-aligned on desktop */}
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-8 w-full">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-2xl shrink-0"
          >
            <span className="text-white text-4xl md:text-5xl font-bold font-momken">
              {getInitials(reciter.name)}
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
              {reciter.name}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-white/10 text-white backdrop-blur-sm border border-white/10">
                <Headphones size={18} />
                {currentMoshaf.name}
              </span>
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-white/10 text-white backdrop-blur-sm border border-white/10">
                <Music size={18} />
                {currentMoshaf.surah_total} سورة
              </span>
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-white/10 text-white backdrop-blur-sm border border-white/10">
                <BookOpen size={18} />
                القرآن الكريم
              </span>
            </div>
          </motion.div>
        </div>
      </PageHero>

      {/* ── Main Content ───────────────────────────────── */}
      <section className="py-12 bg-background transition-colors">
        <div className="max-w-7xl mx-auto px-4 md:px-8" dir="rtl">
          {/* Search bar */}
          <div className="mb-8 -mt-8 px-2">
            <div className="relative group">
              {/* Glow accent */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-primary/30 via-primary/10 to-primary/30 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-sm" />
              <div className="relative flex items-center bg-background/95 dark:bg-card/80 backdrop-blur-xl border border-border/60 group-focus-within:border-primary/50 rounded-2xl shadow-lg transition-all duration-300">
                <Search
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition-colors duration-300"
                  size={22}
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ابحث عن سورة بالاسم..."
                  className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/60 pr-14 pl-6 py-4 text-base focus:outline-none rounded-2xl"
                  dir="rtl"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-muted hover:bg-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-all duration-200"
                  >
                    <span className="text-xs font-bold">✕</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            {/* Moshaf Selector (if multiple) */}
            {reciter.moshaf.length > 1 && (
              <div className="mb-4">
                <label className="block text-sm font-bold text-foreground mb-2">
                  اختر الرواية
                </label>
                <div className="flex flex-wrap gap-2">
                  {reciter.moshaf.map((moshaf, idx) => (
                    <button
                      key={moshaf.id}
                      onClick={() => {
                        setSelectedMoshafIndex(idx);
                        setCurrentSurah(null);
                        setShowPlayer(false);
                        setIsPlaying(false);
                      }}
                      className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all ${selectedMoshafIndex === idx
                        ? "bg-linear-to-r from-[#8B4513] to-[#5d3119] text-white shadow-lg shadow-primary/30"
                        : "bg-card border border-border text-foreground hover:border-primary"
                        }`}
                    >
                      {moshaf.name}
                      <span className="mr-1 text-xs opacity-70">
                        ({moshaf.surah_total})
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Surahs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pagedSurahs.map((surah, idx) => {
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
                  className={`group text-right rounded-3xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 border ${isActive
                    ? "bg-linear-to-br from-[#8B4513]/10 to-[#5d3119]/5 border-[#8B4513]/30 shadow-[#8B4513]/10"
                    : "bg-card border-border hover:border-[#8B4513]/25"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Surah Number */}
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold transition-colors ${isActive
                        ? "bg-linear-to-br from-[#8B4513] to-[#5d3119] text-white"
                        : "bg-[#8B4513]/8 text-[#8B4513] dark:text-[#d4a574] group-hover:bg-[#8B4513]/15"
                        }`}
                    >
                      {surah.number}
                    </div>

                    {/* Surah Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-4xl text-foreground truncate" style={{ fontFamily: "var(--font-surah-name)" }}>
                        سورة {surah.name}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {surah.numberOfAyahs} آية • {surah.englishName}
                      </p>
                    </div>

                    {/* Play Icon */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isActive && isPlaying
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

          {/* Pagination */}
          {pageCount > 1 && (
            <Pagination
              currentPage={page}
              totalPages={pageCount}
              onPageChange={setPage}
              className="mt-12"
            />
          )}
        </div>
      </section>

      {/* ── Fixed Audio Player ────────────────────────── */}
      {showPlayer && currentSurah && (
        <>
          {/* ── Mini Player ── */}
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: isFullscreen ? 100 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-2xl border-t border-border shadow-2xl z-50 px-4 py-4"
          >
            {/* Mobile Absolute Buttons */}
            <button
              onClick={closePlayer}
              className="md:hidden absolute top-4 left-4 p-2 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 text-muted-foreground hover:bg-muted transition z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <button
              onClick={toggleFullscreen}
              className="md:hidden absolute top-4 right-4 p-2 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 text-muted-foreground hover:bg-muted transition z-10"
            >
              <Maximize2 className="w-5 h-5" />
            </button>

            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-4">
              {/* Current Surah Info */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#8B4513] to-[#5d3119] flex items-center justify-center text-white font-bold shrink-0">
                  {currentSurah.number}
                </div>
                <div className="min-w-0">
                  <h4 className="font-medium text-4xl text-foreground truncate" dir="rtl" style={{ fontFamily: "var(--font-surah-name)" }}>
                    سورة {currentSurah.name}
                  </h4>
                  <p className="text-sm text-muted-foreground truncate" dir="rtl">
                    {reciter.name}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4 md:gap-2">
                <button onClick={skipPrevious} className="p-2 rounded-full hover:bg-primary/10 transition">
                  <SkipForward className="w-5 h-5 text-muted-foreground" />
                </button>
                <button
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-linear-to-br from-[#8B4513] to-[#5d3119] hover:opacity-90 flex items-center justify-center transition-all shadow-lg shadow-[#8B4513]/25"
                >
                  {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white -mr-0.5" />}
                </button>
                <button onClick={skipNext} className="p-2 rounded-full hover:bg-primary/10 transition">
                  <SkipBack className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Progress Bar (LTR) */}
              <div className="flex-1 flex items-center gap-3 max-w-md" dir="ltr">
                <span className="text-xs text-muted-foreground w-10 text-right">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 h-1.5 bg-primary/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#8B4513]"
                />
                <span className="text-xs text-muted-foreground w-10">{formatTime(duration)}</span>
              </div>

              {/* Volume & Fullscreen & Close (LTR) */}
              <div className="hidden md:flex items-center gap-2" dir="ltr">
                <button onClick={closePlayer} className="p-2 rounded-full hover:bg-primary/10 transition">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
                <button onClick={toggleFullscreen} className="p-2 rounded-full hover:bg-primary/10 transition ml-1" title="Fullscreen">
                  <Maximize2 className="w-5 h-5 text-muted-foreground" />
                </button>
                <div className="w-px h-6 bg-border mx-2" /> {/* Divider */}
                <button onClick={toggleMute} className="p-2 rounded-full hover:bg-primary/10 transition">
                  {isMuted ? <VolumeX className="w-5 h-5 text-muted-foreground" /> : <Volume2 className="w-5 h-5 text-muted-foreground" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1.5 bg-primary/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#8B4513]"
                />
              </div>
            </div>
          </motion.div>

          {/* ── Fullscreen Overlay ── */}
          <AnimatePresence>
            {isFullscreen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="fixed inset-0 z-[60] flex flex-col"
                onMouseMove={handleFsMouseMove}
                style={{ cursor: showFsControls ? "default" : "none" }}
              >
                {/* Background */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${process.env.NEXT_PUBLIC_CLOUDINARY_ROOT}/image/upload/v1771248764/quran-audio-header_tqedwh.png')` }}
                >
                  <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />
                </div>

                {/* Top Bar — auto-hides on mouse inactivity */}
                <motion.div
                  animate={{ opacity: showFsControls ? 1 : 0, y: showFsControls ? 0 : -16 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 flex items-center justify-between p-5 md:p-7 pointer-events-none"
                >
                  <button
                    onClick={toggleFullscreen}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm border border-white/10 pointer-events-auto"
                  >
                    <Minimize2 size={18} />
                  </button>
                  <div />
                  <button
                    onClick={closePlayer}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm border border-white/10 pointer-events-auto"
                  >
                    <X size={18} />
                  </button>
                </motion.div>

                {/* Main Content */}
                <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center gap-8">

                  {/* Sound Wave Visualizer */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <SoundWave isPlaying={isPlaying} />
                  </motion.div>

                  {/* Text Block */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="space-y-3"
                  >
                    <p className="text-white/50 text-sm md:text-base tracking-[0.2em] uppercase font-light">
                      الآن تستمع إلى
                    </p>
                    <h1
                      className="text-5xl md:text-7xl lg:text-8xl font-medium text-white leading-tight"
                      style={{ fontFamily: "var(--font-surah-name)" }}
                    >
                      سورة {currentSurah.name}
                    </h1>
                    <div className="flex items-center justify-center gap-3 text-white/60 text-base md:text-lg" dir="rtl">
                      <span>{currentSurah.numberOfAyahs} آية</span>
                      <span className="w-1 h-1 rounded-full bg-white/30" />
                      <span>{currentSurah.englishName}</span>
                    </div>
                    <p className="text-white/40 text-sm md:text-base pt-1">
                      بصوت القارئ
                    </p>
                    <p className="text-white/80 text-lg md:text-xl font-semibold font-momken">
                      {reciter.name}
                    </p>
                  </motion.div>

                  {/* Controls */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="w-full max-w-2xl space-y-8"
                  >
                    {/* Progress Bar */}
                    <div className="space-y-2" dir="ltr">
                      <div className="relative h-1 bg-white/15 rounded-full cursor-pointer group/prog">
                        {/* Filled */}
                        <div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#c8956c] to-[#e8b48a] rounded-full transition-all duration-100"
                          style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                        />
                        {/* Thumb */}
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg opacity-0 group-hover/prog:opacity-100 transition-opacity"
                          style={{ left: `calc(${(currentTime / (duration || 1)) * 100}% - 7px)` }}
                        />
                        <input
                          type="range"
                          min={0}
                          max={duration || 100}
                          step={0.1}
                          value={currentTime}
                          onChange={handleSeek}
                          className="absolute inset-0 w-full opacity-0 cursor-pointer"
                        />
                      </div>
                      <div className="flex justify-between text-white/40 text-xs font-mono">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>

                    {/* Playback Buttons */}
                    <div className="flex items-center justify-center gap-8 md:gap-12">
                      {/* Skip Previous */}
                      <button
                        onClick={skipPrevious}
                        className="group flex flex-col items-center gap-1.5"
                        title="السابق"
                      >
                        <div className="w-12 h-12 rounded-full bg-white/8 group-hover:bg-white/15 border border-white/10 group-hover:border-white/25 flex items-center justify-center transition-all duration-300 group-hover:scale-110 active:scale-90">
                          <SkipForward size={22} strokeWidth={1.5} className="text-white/70 group-hover:text-white" />
                        </div>
                      </button>

                      {/* Play / Pause */}
                      <button
                        onClick={togglePlay}
                        className="relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
                      >
                        {/* Glow ring */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#c8956c] to-[#8B4513] opacity-80 blur-sm" />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#d4a574] to-[#8B4513]" />
                        <div className="relative z-10">
                          {isPlaying ? (
                            <Pause size={36} className="text-white fill-white" />
                          ) : (
                            <Play size={36} className="text-white fill-white ml-1" />
                          )}
                        </div>
                      </button>

                      {/* Skip Next */}
                      <button
                        onClick={skipNext}
                        className="group flex flex-col items-center gap-1.5"
                        title="التالي"
                      >
                        <div className="w-12 h-12 rounded-full bg-white/8 group-hover:bg-white/15 border border-white/10 group-hover:border-white/25 flex items-center justify-center transition-all duration-300 group-hover:scale-110 active:scale-90">
                          <SkipBack size={22} strokeWidth={1.5} className="text-white/70 group-hover:text-white" />
                        </div>
                      </button>
                    </div>

                    {/* Volume */}
                    <div className="flex items-center justify-center gap-4 max-w-xs mx-auto" dir="ltr">
                      <button
                        onClick={toggleMute}
                        className="text-white/40 hover:text-white/80 transition-colors duration-200"
                      >
                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                      </button>
                      <div className="flex-1 relative h-1 bg-white/15 rounded-full cursor-pointer group/vol">
                        <div
                          className="absolute inset-y-0 left-0 bg-white/60 rounded-full"
                          style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                        />
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover/vol:opacity-100 transition-opacity"
                          style={{ left: `calc(${(isMuted ? 0 : volume) * 100}% - 6px)` }}
                        />
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.01}
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="absolute inset-0 w-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
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
