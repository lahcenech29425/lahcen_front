"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  deriveMethodForTimezone,
  fetchAladhanTimings,
  pickCountryCodeFromTimezone,
  fetchHijriFromGregorian,
} from "@/utils/prayerApi";
import Link from "next/link";
import Image from "next/image";
import LocationSelector from "@/components/custom/prayer/LocationSelector";
import ToastContainer from "@/components/elements/ToastContainer";
import { useToast } from "@/hooks/useToast";
import {
  getNextPrayer,
  normalizePrayerDay,
} from "@/shared/normalizers/normalizePrayer";
import {
  NormalizedPrayerDay,
  NextPrayerInfo,
  PrayerName,
} from "@/types/Prayer";
import NextPrayerBanner from "@/components/custom/prayer/NextPrayerBanner";
import PrayerGrid from "@/components/custom/prayer/PrayerGrid";
import { Calendar, Moon, MapPin } from "lucide-react";

type GeoStatus = "idle" | "requesting" | "granted" | "denied" | "unavailable";

function LiveClock() {
  const [now, setNow] = useState<string>("");
  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("ar", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(new Date());
    setNow(fmt());
    const id = setInterval(() => setNow(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="mx-auto mt-5 w-64 rounded-md border-2 border-white/20 bg-black/20 px-4 py-2">
      <span className="block text-4xl font-bold tabular-nums">{now}</span>
    </div>
  );
}

export default function PrayerPageClient() {
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [day, setDay] = useState<NormalizedPrayerDay | null>(null);
  const [next, setNext] = useState<NextPrayerInfo | null>(null);
  const [placeAr, setPlaceAr] = useState<string | null>(null);

  const { toasts, addToast, removeToast, success } = useToast();

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
      const normalized = normalizePrayerDay(json);
      const fajr = normalized.timings.Fajr;
      if (fajr) {
        const diff = fajr.date.getTime() - new Date().getTime();
        setNext({ name: "Fajr", date: fajr.date, inMs: diff });
      }
    } catch (e) {
      console.error("Failed to fetch tomorrow's Fajr", e);
    }
  }, [coords]);

  // Acquire geolocation
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setGeoStatus("unavailable");
      return;
    }
    setGeoStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoStatus("granted");
      },
      (err) => {
        console.warn("Geolocation error", err);
        setGeoStatus("denied");
        addToast(
          "لم نتمكن من الحصول على موقعك. يرجى اختيار موقعك يدوياً.",
          "warning"
        );
      },
      { enableHighAccuracy: true, maximumAge: 60_000, timeout: 15_000 }
    );
  }, [addToast]);

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
          } catch {}
        }
        setDay(normalized);
        const nextPrayer = getNextPrayer(new Date(), normalized);

        // If all prayers passed, fetch tomorrow's Fajr
        if (!nextPrayer) {
          await fetchTomorrowFajr();
        } else {
          setNext(nextPrayer);
        }

        // Reverse geocode to Arabic city/country (best-effort)
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
          // ignore if reverse geocode fails
        }
      } catch (e) {
        console.error(e as unknown);
        setError("تعذر جلب أوقات الصلاة. حاول لاحقاً.");
      }
    };
    run();
  }, [coords, fetchTomorrowFajr]);

  // Update next prayer every minute if needed
  useEffect(() => {
    if (!day) return;
    const id = setInterval(() => {
      const nextPrayer = getNextPrayer(new Date(), day);
      setNext(nextPrayer);

      // If all prayers passed, fetch tomorrow's Fajr
      if (!nextPrayer && coords) {
        fetchTomorrowFajr();
      }
    }, 30_000);
    return () => clearInterval(id);
  }, [day, coords, fetchTomorrowFajr]);

  const nextName: PrayerName | undefined = useMemo(() => next?.name, [next]);

  const tz =
    typeof window !== "undefined"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : undefined;
  const cc = pickCountryCodeFromTimezone(tz);

  // Helpers
  const formatGregorianAr = (d?: { date: string; readable: string }) => {
    if (!d) return "";
    // Prefer the dd-mm-yyyy because readable may be non-Arabic
    const [dd, mm, yyyy] = (d.date || "").split("-");
    const js =
      dd && mm && yyyy
        ? new Date(Number(yyyy), Number(mm) - 1, Number(dd))
        : new Date();
    return new Intl.DateTimeFormat("ar", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(js);
  };

  const GregorianArabic = formatGregorianAr(day?.gregorian);

  return (
    <div dir="rtl" className="max-w-7xl mx-auto px-4 py-8 text-right">
      {/* Breadcrumb */}
      <nav className="mb-10 text-sm text-gray-900" aria-label="مسار التنقل">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-gray-700">
              الرئيسية
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium">أوقات الصلاة</li>
        </ol>
      </nav>

      {/* Hero Section - صورة خلفية + عنوان + آية + بطاقات التاريخ */}
      <section className="relative overflow-hidden rounded-3xl bg-[#171717] text-white shadow-2xl">
        {/* خلفية بصورة عامة optimisée avec Next.js Image */}
        <Image
          src="/prayer/2.jpg"
          alt="Prayer background"
          fill
          priority
          quality={85}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1280px"
          className="object-cover object-center"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        <div
          className="absolute inset-0 bg-gradient-to-tr from-black/80 via-[#171717]/70 to-transparent z-10"
          aria-hidden
        />
        <div className="relative z-20 px-6 py-10 sm:px-10 sm:py-14">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              أوقات الصلاة
            </h1>
            <p className="mt-3 text-white/90 text-lg">
              إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا
            </p>
            <div className="mt-1 text-sm text-white/70">
              سورة النساء • آية ١٠٣
            </div>
            {(placeAr || cc) && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm">
                <MapPin className="h-4 w-4" />
                <span>{placeAr ?? cc}</span>
              </div>
            )}

            {/* الساعة الحية */}
            <LiveClock />
          </div>

          {/* بطاقتا التاريخ (ميلادي / هجري) في أسفل الحاوية */}
          {day && (
            <div className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* الميلادي */}
              <div className="group rounded-2xl bg-white/5 border border-white/10 backdrop-blur px-4 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center rounded-xl bg-white/10 p-2">
                    <Calendar className="h-5 w-5 text-white/90" />
                  </span>
                  <div>
                    <div className="text-xs text-white/70">
                      التاريخ الميلادي
                    </div>
                    <div className="text-base sm:text-lg font-semibold">
                      {GregorianArabic}
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-white/60">{day.timezone}</div>
              </div>
              {/* الهجري */}
              <div className="group rounded-2xl bg-white/5 border border-white/10 backdrop-blur px-4 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center rounded-xl bg-white/10 p-2">
                    <Moon className="h-5 w-5 text-white/90" />
                  </span>
                  <div>
                    <div className="text-xs text-white/70">التاريخ الهجري</div>
                    <div className="text-base sm:text-lg font-semibold">
                      {day.hijri.readable ?? day.hijri.date}
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-white/60">هجري</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Toasts */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {(geoStatus === "denied" || geoStatus === "unavailable") && !coords && (
        <div className="mb-8">
          <LocationSelector
            onLocationSelect={(lat, lng, city) => {
              setCoords({ lat, lng });
              setPlaceAr(city);
              success(`تم تحديد موقعك: ${city}`);
            }}
          />
        </div>
      )}

      {/* Avoid duplicating geolocation denial error when manual selection is shown */}
      {error && coords && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Show loading skeleton while fetching prayer times */}
      {coords && !day ? (
        <>
          <NextPrayerBanner nextPrayer={null} isLoading={true} />
          <div className="mt-6 text-center text-gray-500 animate-pulse">
            جاري تحميل أوقات الصلاة...
          </div>
        </>
      ) : day ? (
        <>
          <NextPrayerBanner nextPrayer={next} isLoading={false} />
          <PrayerGrid day={day} nextName={nextName} />
        </>
      ) : null}

      <>
        {/* فضائل الصلاة */}
        <section className="mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
            <span className="inline-block h-1.5 w-10 bg-gray-900 rounded-full"></span>
            فضائل الصلاة
          </h2>
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-gray-50 border border-gray-200">
              <p className="text-lg leading-relaxed text-gray-800">
                قال رسول الله ﷺ:{" "}
                <span className="font-semibold text-gray-900">
                  «الصَّلَوَاتُ الخَمْسُ، وَالْجُمُعَةُ إِلَى الْجُمُعَةِ،
                  كَفَّارَاتٌ لِمَا بَيْنَهُنَّ، مَا لَمْ تُغْشَ الكَبَائِرُ»
                </span>
              </p>
              <p className="text-sm text-gray-600 mt-3 pt-3 border-t border-gray-200">
                رواه مسلم
              </p>
            </div>
            <div className="p-5 rounded-xl bg-gray-50 border border-gray-200">
              <p className="text-lg leading-relaxed text-gray-800">
                قال رسول الله ﷺ:{" "}
                <span className="font-semibold text-gray-900">
                  «أَرَأَيْتُمْ لَوْ أَنَّ نَهْرًا بِبَابِ أَحَدِكُمْ يَغْتَسِلُ
                  مِنْهُ كُلَّ يَوْمٍ خَمْسَ مَرَّاتٍ، هَلْ يَبْقَى مِنْ
                  دَرَنِهِ شَيْءٌ؟»
                </span>{" "}
                قَالُوا: لَا يَبْقَى مِنْ دَرَنِهِ شَيْءٌ، قَالَ:{" "}
                <span className="font-semibold text-gray-900">
                  « فَذَلِكَ مَثَلُ الصَّلَوَاتِ الخَمْسِ، يَمْحُو اللَّهُ بِهِنَّ الخَطَايَا »
                </span>
              </p>
              <p className="text-sm text-gray-600 mt-3 pt-3 border-t border-gray-200">
                متفق عليه
              </p>
            </div>
          </div>
        </section>

        {/* آداب الصلاة */}
        <section className="mt-8 bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
            <span className="inline-block h-1.5 w-10 bg-gray-900 rounded-full"></span>
            آداب الصلاة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all">
              <h3 className="font-bold text-gray-900 mb-2 text-lg">الطهارة</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                تأكد من الوضوء الصحيح وطهارة الثوب والمكان
              </p>
            </div>
            <div className="p-5 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all">
              <h3 className="font-bold text-gray-900 mb-2 text-lg">
                ستر العورة
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                الزم الحشمة واللباس المناسب للصلاة
              </p>
            </div>
            <div className="p-5 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all">
              <h3 className="font-bold text-gray-900 mb-2 text-lg">
                استقبال القبلة
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                توجه نحو الكعبة المشرفة في مكة المكرمة
              </p>
            </div>
            <div className="p-5 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all">
              <h3 className="font-bold text-gray-900 mb-2 text-lg">الخشوع</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                حضور القلب والتركيز في الصلاة والابتعاد عن الوساوس
              </p>
            </div>
            <div className="p-5 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all">
              <h3 className="font-bold text-gray-900 mb-2 text-lg">
                الطمأنينة
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                أداء الأركان بسكينة وعدم العجلة
              </p>
            </div>
            <div className="p-5 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all">
              <h3 className="font-bold text-gray-900 mb-2 text-lg">
                الصلاة في وقتها
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                المبادرة لأداء الصلاة في أول وقتها
              </p>
            </div>
          </div>
        </section>

        {/* نصائح للمحافظة على الصلاة */}
        <section className="mt-8 bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
            <span className="inline-block h-1.5 w-10 bg-gray-900 rounded-full"></span>
            نصائح للمحافظة على الصلاة
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-gray-900 flex-shrink-0"></span>
              <span className="text-gray-800 leading-relaxed">
                اضبط المنبه قبل وقت كل صلاة بـ 10-15 دقيقة للاستعداد
              </span>
            </li>
            <li className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-gray-900 flex-shrink-0"></span>
              <span className="text-gray-800 leading-relaxed">
                حافظ على صلاة الجماعة في المسجد لما لها من أجر عظيم
              </span>
            </li>
            <li className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-gray-900 flex-shrink-0"></span>
              <span className="text-gray-800 leading-relaxed">
                اجعل لنفسك مكاناً ثابتاً للصلاة في البيت نظيفاً وهادئاً
              </span>
            </li>
            <li className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-gray-900 flex-shrink-0"></span>
              <span className="text-gray-800 leading-relaxed">
                احرص على الأذكار بعد الصلاة لتحصيل الأجر الكامل
              </span>
            </li>
            <li className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-gray-900 flex-shrink-0"></span>
              <span className="text-gray-800 leading-relaxed">
                تذكر أن الصلاة هي الفارق بين المسلم وغيره، فلا تتهاون بها
              </span>
            </li>
          </ul>
        </section>

        {/* آيات قرآنية عن الصلاة */}
        <section className="mt-8 mb-12 bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
            <span className="inline-block h-1.5 w-10 bg-gray-900 rounded-full"></span>
            آيات قرآنية عن الصلاة
          </h2>
          <div className="space-y-4">
            <div className="p-6 rounded-xl bg-gray-50 border border-gray-200">
              <p className="text-xl md:text-2xl leading-relaxed mb-3 font-arabic text-gray-900">
                ﴿ حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ
                وَقُومُوا لِلَّهِ قَانِتِينَ ﴾
              </p>
              <p className="text-sm text-gray-600 pt-3 border-t border-gray-200">
                سورة البقرة • آية ٢٣٨
              </p>
            </div>
            <div className="p-6 rounded-xl bg-gray-50 border border-gray-200">
              <p className="text-xl md:text-2xl leading-relaxed mb-3 font-arabic text-gray-900">
                ﴿ وَأَقِمِ الصَّلَاةَ إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ
                الْفَحْشَاءِ وَالْمُنكَرِ ﴾
              </p>
              <p className="text-sm text-gray-600 pt-3 border-t border-gray-200">
                سورة العنكبوت • آية ٤٥
              </p>
            </div>
            <div className="p-6 rounded-xl bg-gray-50 border border-gray-200">
              <p className="text-xl md:text-2xl leading-relaxed mb-3 font-arabic text-gray-900">
                ﴿ وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ وَإِنَّهَا لَكَبِيرَةٌ
                إِلَّا عَلَى الْخَاشِعِينَ ﴾
              </p>
              <p className="text-sm text-gray-600 pt-3 border-gray-200">
                سورة البقرة • آية ٤٥
              </p>
            </div>
          </div>
        </section>
      </>
    </div>
  );
}
