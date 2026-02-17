"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  deriveMethodForTimezone,
  fetchAladhanTimings,
  pickCountryCodeFromTimezone,
  fetchHijriFromGregorian,
} from "@/utils/prayerApi";
import Image from "next/image";
import LocationSelector from "@/components/custom/prayer/LocationSelector";
import PrayerCalendar from "@/components/custom/prayer/PrayerCalendar";
import DateConverter from "@/components/custom/prayer/DateConverter";
import Breadcrumb from "@/components/elements/Breadcrumb";
import ToastContainer from "@/components/elements/ToastContainer";
import { useToast } from "@/hooks/useToast";
import {
  getNextPrayer,
  normalizePrayerDay,
  formatCountdown,
} from "@/shared/normalizers/normalizePrayer";
import {
  NormalizedPrayerDay,
  NextPrayerInfo,
  PrayerName,
} from "@/types/Prayer";
import {
  Calendar,
  Moon,
  MapPin,
  Clock,
  BookOpen,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";

type GeoStatus = "idle" | "requesting" | "granted" | "denied" | "unavailable";

const PRAYER_NAMES_AR: Record<string, string> = {
  Fajr: "الفجر",
  Sunrise: "الشروق",
  Dhuhr: "الظهر",
  Asr: "العصر",
  Maghrib: "المغرب",
  Isha: "العشاء",
};

export default function PrayerPageClient() {
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [day, setDay] = useState<NormalizedPrayerDay | null>(null);
  const [next, setNext] = useState<NextPrayerInfo | null>(null);
  const [placeAr, setPlaceAr] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<string>("--:--:--");
  const [now, setNow] = useState(new Date());
  const [showLocationSelector, setShowLocationSelector] = useState(false);

  const { toasts, addToast, removeToast, success } = useToast();
  const hasMounted = useRef(false);

  // Clock Ticker
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Reusable function to request location
  const handleRequestLocation = async () => {
    setGeoStatus("requesting");

    // Internal function to handle success from any source
    const onLocationFound = (
      lat: number,
      lng: number,
      source: "gps" | "ip",
    ) => {
      console.log(`Location found via ${source}:`, lat, lng);
      setCoords({ lat, lng });
      setGeoStatus("granted");
      success(
        source === "gps"
          ? "تم تحديد موقعك بدقة!"
          : "تم تحديد موقعك التقريبي عبر الإنترنت.",
      );
    };

    // 1. Try IP Geolocation Fallback
    const tryIpLocation = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (!res.ok) throw new Error("IP API failed");
        const data = await res.json();
        if (data.latitude && data.longitude) {
          onLocationFound(data.latitude, data.longitude, "ip");
          return true;
        }
      } catch (error) {
        console.warn("IP Geolocation failed:", error);
      }
      return false;
    };

    // 2. Try Browser Geolocation
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          onLocationFound(pos.coords.latitude, pos.coords.longitude, "gps"),
        async (err) => {
          console.warn("GPS failed, trying IP fallback...", err);
          const ipSuccess = await tryIpLocation();
          if (!ipSuccess) {
            setGeoStatus("denied");
            addToast(
              "تعذر تحديد الموقع تلقائياً. يرجى الاختيار يدوياً.",
              "warning",
            );
          }
        },
        { enableHighAccuracy: false, timeout: 7000, maximumAge: 0 },
      );
    } else {
      // No navigator support, try IP directly
      const ipSuccess = await tryIpLocation();
      if (!ipSuccess) {
        setGeoStatus("unavailable");
        addToast("المتصفح لا يدعم تحديد الموقع.", "error");
      }
    }
  };

  // Attempt to locate on mount IF not already set (guard against StrictMode double-fire)
  useEffect(() => {
    if (hasMounted.current) return;
    hasMounted.current = true;
    handleRequestLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch tomorrow's Fajr when all prayers passed
  const fetchTomorrowFajr = React.useCallback(async () => {
    if (!coords) return;
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dd = String(tomorrow.getDate()).padStart(2, "0");
      const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
      const yyyy = tomorrow.getFullYear();
      const dateStr = `${dd}-${mm}-${yyyy}`;

      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const { method, latitudeAdjustmentMethod } =
        await deriveMethodForTimezone(tz, coords.lat, coords.lng);
      const json = await fetchAladhanTimings({
        date: dateStr,
        latitude: coords.lat,
        longitude: coords.lng,
        timezonestring: tz,
        method,
        latitudeAdjustmentMethod,
      });
      const normalized = normalizePrayerDay(json, tomorrow);
      const fajr = normalized.timings.Fajr;
      if (fajr) {
        const diff = fajr.date.getTime() - new Date().getTime();
        setNext({ name: "Fajr", date: fajr.date, inMs: diff });
      }
    } catch (e) {
      console.error("Failed to fetch tomorrow's Fajr", e);
    }
  }, [coords]);

  // Fetch timings when we have coordinates
  useEffect(() => {
    const run = async () => {
      if (!coords) return;
      try {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const yyyy = today.getFullYear();
        const dateStr = `${dd}-${mm}-${yyyy}`;

        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const { method, latitudeAdjustmentMethod } =
          await deriveMethodForTimezone(tz, coords.lat, coords.lng);
        const json = await fetchAladhanTimings({
          date: dateStr,
          latitude: coords.lat,
          longitude: coords.lng,
          timezonestring: tz,
          method,
          latitudeAdjustmentMethod,
        });
        const normalized = normalizePrayerDay(json);
        // Ensure Hijri readable label, fallback to conversion API if missing
        if (!normalized.hijri.readable) {
          try {
            const conv = await fetchHijriFromGregorian(dateStr);
            normalized.hijri.readable = conv.hijriReadable;
            normalized.hijri.date = conv.hijriDate;
          } catch { }
        }
        setDay(normalized);
        const nextPrayer = getNextPrayer(new Date(), normalized);

        // If all prayers passed, fetch tomorrow's Fajr
        if (!nextPrayer) {
          await fetchTomorrowFajr();
        } else {
          setNext(nextPrayer);
        }

        // Reverse geocode
        try {
          const url = new URL("https://nominatim.openstreetmap.org/reverse");
          url.searchParams.set("lat", String(coords.lat));
          url.searchParams.set("lon", String(coords.lng));
          url.searchParams.set("format", "json");
          url.searchParams.set("accept-language", "ar");
          const res = await fetch(url.toString(), {
            headers: { "User-Agent": "PrayerTimesApp/1.0" },
          });
          if (res.ok) {
            const data = await res.json();
            const city =
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              data.address?.state;
            const country = data.address?.country;
            if (city || country)
              setPlaceAr([city, country].filter(Boolean).join("، "));
          }
        } catch {
          // ignore
        }
      } catch (e) {
        console.error(e as unknown);
        setError("تعذر جلب أوقات الصلاة. حاول لاحقاً.");
      }
    };
    run();
  }, [coords, fetchTomorrowFajr]);

  // Update next prayer & countdown
  useEffect(() => {
    if (!next) return;
    const tick = () => {
      const now = Date.now();
      const diff = next.date.getTime() - now;

      if (diff <= 0) {
        if (coords) fetchTomorrowFajr();
        return;
      }
      setRemaining(formatCountdown(diff));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [next, coords, fetchTomorrowFajr]);

  const tz =
    typeof window !== "undefined"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : undefined;
  const cc = pickCountryCodeFromTimezone(tz);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('/assets/bg.svg')] bg-repeat bg-center"></div>

      {/* SECTION 1: HERO */}
      <section className="relative pt-32 pb-20 text-center text-white overflow-hidden min-h-[95vh] flex flex-col justify-between">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/prayer-time-header.png"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </div>

        {/* Background Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[900px] md:h-[900px] bg-primary opacity-[0.1] blur-[100px] rounded-full pointer-events-none" />

        {/* Header / Breadcrumb */}
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center z-10 gap-4 text-white/90 relative mb-8">
          <div className="w-full flex justify-start">
            <Breadcrumb
              items={[{ label: "أوقات الصلاة" }]}
              className="text-white"
            />
          </div>
        </div>

        {/* TOP SECTION: Title & Description */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center w-full max-w-4xl mx-auto mb-8"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-momken text-white mb-4 drop-shadow-xl">
            مواقيت الصلاة
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            تعرّف على مواقيت الصلاة بدقة حسب موقعك. وقتك الثمين يبدأ من هنا.
          </p>
        </motion.div>

        {/* Location Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative z-10 flex flex-wrap justify-center gap-4 w-full max-w-7xl mx-auto mb-12"
        >
          <button
            onClick={handleRequestLocation}
            disabled={geoStatus === "requesting"}
            className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 hover:bg-white/20 transition-all group disabled:opacity-70 disabled:cursor-wait min-w-[200px] justify-center"
          >
            <div
              className={`p-2 rounded-lg ${geoStatus === "requesting" ? "animate-pulse" : ""}`}
            >
              <MapPin
                className="text-white group-hover:scale-110 transition-transform"
                size={20}
              />
            </div>
            <span className="font-bold text-white text-lg">
              {geoStatus === "requesting"
                ? "جاري الموقع..."
                : placeAr || cc || "تحديد موقعي"}
            </span>
          </button>
        </motion.div>

        {/* MIDDLE SECTION: Next Prayer & Countdown */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-12 w-full max-w-7xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 w-full">
            {/* Next Prayer Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/20 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/20 shadow-2xl w-full max-w-sm transform hover:scale-[1.02] transition-transform duration-500"
            >
              <div className="flex flex-col items-center gap-4">
                <span className="text-white/80 text-lg font-medium tracking-wide">
                  الصلاة القادمة
                </span>
                <h1 className="text-5xl font-black font-momken text-white shadow-black/10 drop-shadow-lg text-center leading-tight">
                  {next ? PRAYER_NAMES_AR[next.name] : "..."}
                </h1>
                <div className="h-[1px] w-24 bg-white/30 my-2" />
                <p className="text-xl text-white/90 font-amiri">
                  {next ? "متبقي على رفع الأذان" : "جاري حساب الوقت..."}
                </p>
              </div>
            </motion.div>

            {/* Circular Countdown */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="relative w-[300px] h-[300px] md:w-[380px] md:h-[380px] flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/10 shadow-2xl"
            >
              {/* Complex Rings - WHITE Style */}
              <div className="absolute inset-0 border-[1px] border-white/10 rounded-full" />
              <div className="absolute inset-4 border-[2px] border-white/5 rounded-full" />

              {/* Spinning Rings - BRIGHT WHITE */}
              <div className="absolute inset-[-10px] border-[1px] border-t-white/40 border-r-transparent border-b-white/10 border-l-transparent rounded-full animate-[spin_10s_linear_infinite]" />
              <div className="absolute inset-8 border-[2px] border-b-white/30 border-t-transparent border-l-white/10 border-r-transparent rounded-full animate-[spin_15s_linear_infinite_reverse]" />

              {/* Glow effect inside */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl transform scale-90" />

              {/* Main Time Remaining Display */}
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-6xl md:text-8xl font-black tabular-nums text-white tracking-tighter leading-none font-sans">
                  {next ? remaining : "--:--:--"}
                </span>
                {!next && day && (
                  <p className="text-xs text-white/60 mt-2 animate-pulse">
                    جاري حساب وقت الصلاة...
                  </p>
                )}
                <div className="flex items-center gap-4 mt-4 opacity-80 text-white">
                  <span className="text-[10px] md:text-xs font-bold tracking-[0.2em]">
                    ساعات
                  </span>
                  <span className="text-[10px] md:text-xs font-bold tracking-[0.2em]">
                    دقائق
                  </span>
                  <span className="text-[10px] md:text-xs font-bold tracking-[0.2em]">
                    ثواني
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* DATE, TIME & LOCATION INFO BAR */}
      <section className="container mx-auto px-4 max-w-5xl -mt-12 relative z-30 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-card rounded-[2rem] shadow-xl border border-border p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Hijri Date */}
            {day && (
              <div className="flex items-center gap-3 px-5 py-3 bg-gray-50 dark:bg-[#8B4513]/10 rounded-2xl min-w-[200px] justify-center">
                <div className="w-10 h-10 rounded-xl bg-[#8B4513]/10 dark:bg-[#8B4513]/20 flex items-center justify-center">
                  <Moon className="text-[#8B4513] dark:text-primary" size={20} />
                </div>
                <span className="font-bold text-foreground text-base font-sans">
                  {day.hijri.readable}
                </span>
              </div>
            )}

            {/* Current Time */}
            <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-br from-[#8B4513] to-[#5d3119] rounded-2xl shadow-lg min-w-[160px] justify-center">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Clock className="text-white" size={22} />
              </div>
              <span
                className="font-bold text-white text-2xl font-sans tabular-nums"
                dir="ltr"
              >
                {now.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </span>
            </div>

            {/* Gregorian Date */}
            <div className="flex items-center gap-3 px-5 py-3 bg-gray-50 dark:bg-[#8B4513]/10 rounded-2xl min-w-[200px] justify-center">
              <div className="w-10 h-10 rounded-xl bg-[#8B4513]/10 dark:bg-[#8B4513]/20 flex items-center justify-center">
                <Calendar className="text-[#8B4513] dark:text-primary" size={20} />
              </div>
              <span className="font-bold text-foreground text-base font-amiri">
                <span className="font-sans ml-1">{now.getDate()}</span>
                {new Intl.DateTimeFormat("ar-SA", { month: "long" }).format(
                  now,
                )}
                <span className="font-sans mr-1">{now.getFullYear()}</span>
              </span>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-[1px] h-10 bg-primary/10" />

            {/* Change Location Button */}
            <button
              onClick={() => setShowLocationSelector(true)}
              className="group flex items-center gap-3 px-6 py-3 bg-gray-50 dark:bg-[#8B4513]/10 hover:bg-gray-100 dark:hover:bg-[#8B4513]/20 rounded-2xl transition-all duration-300 border border-[#8B4513]/10 hover:border-[#8B4513]/30 hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-[#8B4513]/10 dark:bg-[#8B4513]/20 flex items-center justify-center group-hover:bg-[#8B4513] transition-colors duration-300">
                <Settings
                  className="text-[#8B4513] dark:text-primary group-hover:text-white group-hover:rotate-90 transition-all duration-300"
                  size={20}
                />
              </div>
              <span className="font-bold text-foreground text-base">
                تغيير الموقع
              </span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* SECTION 2: PRAYER TIMELINE */}
      <section className="container mx-auto px-4 max-w-5xl pb-24 mt-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-card rounded-[3rem] shadow-xl border border-border p-8 md:p-12 relative overflow-hidden"
        >

          <h2 className="text-3xl font-bold font-momken text-center mb-12 text-foreground">
            مواقيت الصلاة اليوم
          </h2>

          {day ? (
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"].map(
                (pName) => {
                  const timing = day.timings[pName as PrayerName];
                  const isNext = next?.name === pName;
                  // Force Western numerals by using 'en-US' locale
                  const timeStr =
                    timing?.date.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    }) || "--:--";

                  return (
                    <div
                      key={pName}
                      className={`relative group p-6 rounded-3xl text-center border transition-all duration-500 ${isNext
                        ? "bg-gradient-to-br from-[#8B4513] to-[#5d3119] text-white border-transparent shadow-[0_15px_40px_rgba(139,69,19,0.3)] scale-110 z-10 ring-4 ring-[#8B4513]/20"
                        : "bg-white dark:bg-card text-gray-900 dark:text-foreground border-transparent hover:border-primary/20 hover:shadow-lg hover:-translate-y-1"
                        }`}
                    >
                      <div
                        className={`text-sm mb-3 font-bold ${isNext ? "opacity-100" : "opacity-60"}`}
                      >
                        {PRAYER_NAMES_AR[pName]}
                      </div>
                      <div className="text-2xl md:text-3xl font-black tabular-nums tracking-tight font-sans">
                        {timeStr}
                      </div>
                      {isNext && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-primary text-[10px] font-black px-3 py-1 rounded-full shadow-md whitespace-nowrap uppercase tracking-widest">
                          القادمة
                        </div>
                      )}
                    </div>
                  );
                },
              )}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400 animate-pulse">
              جاري تحميل الأوقات...
            </div>
          )}
        </motion.div>
      </section>

      {/* SECTION 3: VIRTUES GRID (BENTO) */}
      <section className="container mx-auto px-4 max-w-6xl pb-24">
        <h2 className="text-3xl font-bold font-momken text-center mb-12 text-foreground">
          فضائل وآداب
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Large Card */}
          <div className="md:col-span-2 bg-primary text-primary-foreground rounded-[2.5rem] p-10 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
            <div className="absolute top-[-20%] right-[-10%] opacity-10 rotate-12 transition-transform duration-700 group-hover:rotate-6 group-hover:scale-110">
              <Image
                src="/assets/quran-header.png"
                alt="pattern"
                width={400}
                height={400}
                className="object-contain"
              />
            </div>
            <h3 className="text-3xl font-bold font-momken mb-6 relative z-10">
              مكانة الصلاة
            </h3>
            <p className="text-xl leading-relaxed relative z-10 opacity-90 font-amiri">
              "أَرَأَيْتُمْ لَوْ أَنَّ نَهْرًا بِبَابِ أَحَدِكُمْ يَغْتَسِلُ
              مِنْهُ كُلَّ يَوْمٍ خَمْسَ مَرَّاتٍ، هَلْ يَبْقَى مِنْ دَرَنِهِ
              شَيْءٌ؟"
              <br />
              هكذا شبه النبي ﷺ الصلاة بالنهر الجاري الذي يطهر المؤمن من الخطايا
              والذنوب خمس مرات في اليوم والليلة.
            </p>
          </div>

          {/* Small Card 1 */}
          <div className="bg-card border border-border rounded-[2.5rem] p-8 hover:border-primary/30 hover:shadow-xl transition-all duration-300 group">
            <div className="bg-primary/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
              <Clock className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-bold font-momken text-foreground mb-3">
              الصلاة في وقتها
            </h3>
            <p className="text-gray-600 dark:text-[#d4c5b9] text-sm leading-relaxed">
              أحب الأعمال إلى الله الصلاة على وقتها. احرص على أداء الفريضة فور
              سماع الأذان.
            </p>
          </div>

          {/* Small Card 2 */}
          <div className="bg-card border border-border rounded-[2.5rem] p-8 hover:border-primary/30 hover:shadow-xl transition-all duration-300 group">
            <div className="bg-primary/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
              <Moon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-bold font-momken text-foreground mb-3">
              قيام الليل
            </h3>
            <p className="text-gray-600 dark:text-[#d4c5b9] text-sm leading-relaxed">
              شرف المؤمن قيامه بالليل. ركعتان في جوف الليل خير من الدنيا وما
              فيها.
            </p>
          </div>

          {/* Medium Card */}
          <div className="md:col-span-2 bg-primary/5 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-10 overflow-hidden relative">
            <div className="flex-1 relative z-10">
              <h3 className="text-2xl font-bold font-momken text-primary mb-6">
                آداب المسجد
              </h3>
              <ul className="space-y-4 text-slate-700 dark:text-[#eadfd6]">
                <li className="flex items-center gap-4 group">
                  <span className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-primary font-bold shadow-sm group-hover:scale-110 transition-transform">
                    1
                  </span>
                  تقديم الرجل اليمنى عند الدخول
                </li>
                <li className="flex items-center gap-4 group">
                  <span className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-primary font-bold shadow-sm group-hover:scale-110 transition-transform">
                    2
                  </span>
                  صلاة ركعتين تحية المسجد
                </li>
                <li className="flex items-center gap-4 group">
                  <span className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-primary font-bold shadow-sm group-hover:scale-110 transition-transform">
                    3
                  </span>
                  الحفاظ على الهدوء والسكينة
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="w-48 h-48 bg-background rounded-full flex items-center justify-center shadow-2xl relative z-10">
                <BookOpen className="w-20 h-20 text-primary" />
              </div>
              <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: DATE CONVERTER */}
      <section id="date-converter" className="container mx-auto px-4 max-w-3xl pb-24 scroll-mt-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-card rounded-[3rem] shadow-xl border border-border p-8 md:p-12 relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold font-momken text-foreground mb-3">
                محوّل التاريخ
              </h2>
              <p className="text-gray-600 dark:text-[#d4c5b9] text-lg">
                حوّل التاريخ بين التقويم الميلادي والتقويم الهجري بسهولة
              </p>
            </div>

            <DateConverter />
          </div>
        </motion.div>
      </section>

      {/* SECTION 5: PRAYER CALENDAR */}
      <section id="prayer-calendar" className="container mx-auto px-4 max-w-7xl pb-24 scroll-mt-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-card rounded-[3rem] shadow-xl border border-border p-8 md:p-12 relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold font-momken text-foreground mb-3">
                تقويم أوقات الصلاة
              </h2>
              <p className="text-gray-600 dark:text-[#d4c5b9] text-lg">
                تقويم شهري كامل بجميع أوقات الصلاة حسب موقعك
              </p>
            </div>

            <PrayerCalendar
              coords={coords}
              locationName={placeAr || undefined}
            />
          </div>
        </motion.div >
      </section >

      {/* Manual Location Modal (Conditional) */}
      < ToastContainer toasts={toasts} onRemove={removeToast} />

      {
        (showLocationSelector ||
          ((geoStatus === "denied" || geoStatus === "unavailable") &&
            !coords)) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
            <div className="w-full max-w-md">
              <LocationSelector
                onLocationSelect={(lat, lng, city) => {
                  setCoords({ lat, lng });
                  setPlaceAr(city);
                  setShowLocationSelector(false);
                  success(`تم تحديد موقعك: ${city} `);
                }}
                onClose={() => setShowLocationSelector(false)}
              />
            </div>
          </div>
        )
      }
    </div >
  );
}
