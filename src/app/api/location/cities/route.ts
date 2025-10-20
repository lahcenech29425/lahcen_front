import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type CityOut = {
  name: string;
  country?: string;
  lat: number;
  lng: number;
};

type NominatimItem = {
  display_name?: string;
  lat: string;
  lon: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
  };
};

type OverpassElement = {
  type: "node" | "way" | "relation";
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

// Simple in-memory cache with TTL to speed up repeat queries
const cache = new Map<string, { expires: number; data: CityOut[] }>();
const TTL_MS = 15 * 60 * 1000; // 15 minutes

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country"); // ISO2 code optional
  const q = searchParams.get("q") || "";
  const limit = Math.min(Number(searchParams.get("limit") || 50), 100);

  const key = `${country ?? ""}|${q}|${limit}`;
  const now = Date.now();
  const cached = cache.get(key);
  if (cached && cached.expires > now) {
    return NextResponse.json({ cities: cached.data });
  }

  try {
    const fetchNominatim = async (query: string) => {
      const url = new URL("https://nominatim.openstreetmap.org/search");
      url.searchParams.set("q", query);
      url.searchParams.set("format", "json");
      url.searchParams.set("limit", String(limit));
      url.searchParams.set("accept-language", "ar");
      url.searchParams.set("addressdetails", "1");
      if (country) url.searchParams.set("countrycodes", country.toLowerCase());
      const res = await fetch(url.toString(), {
        headers: { "User-Agent": "PrayerTimesApp/1.0" },
        cache: "no-store",
      });
      if (!res.ok) return [] as NominatimItem[];
      const data: NominatimItem[] = await res.json();
      return data;
    };

    const fetchOverpassByCountry = async (iso2: string) => {
      // Query all nodes/ways/relations tagged as city/town/village in the country area
      // Optimize for speed: nodes only, restrict to city|town (skip villages), lower timeout
      const query = `
        [out:json][timeout:15];
        area["ISO3166-1:alpha2"="${iso2.toUpperCase()}"][admin_level=2]->.a;
        node["place"~"city|town"](area.a);
        out;
      `;
      const res = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ data: query }),
      });
      if (!res.ok) return [] as NominatimItem[];
      const json = (await res.json()) as { elements?: OverpassElement[] };
      const elements = json.elements ?? [];
      const mapped: NominatimItem[] = elements
        .map((el) => {
          const tags = el.tags || {};
          const nameAr = tags["name:ar"]; // prefer Arabic if available
          const name = nameAr || tags.name;
          const lat = el.lat ?? el.center?.lat;
          const lon = el.lon ?? el.center?.lon;
          if (!name || lat == null || lon == null) return null;
          return {
            display_name: name,
            lat: String(lat),
            lon: String(lon),
            address: {},
          } as NominatimItem;
        })
        .filter(Boolean) as NominatimItem[];
      return mapped;
    };

    let raw: NominatimItem[] = [];
    if (q && q.trim().length >= 2) {
      raw = await fetchNominatim(q.trim());
    } else if (country) {
      // Use Overpass to list many cities/towns/villages inside the country
      raw = await fetchOverpassByCountry(country);
      // Fallback augmentation: if Overpass returns few, enrich with Nominatim seeds
      if (raw.length < 5) {
        const [c1, c2, c3] = await Promise.all([
          fetchNominatim("city"),
          fetchNominatim("town"),
          fetchNominatim("village"),
        ]);
        raw = [...raw, ...c1, ...c2, ...c3];
      }
    }

    const items: CityOut[] = raw
      .map((it: NominatimItem) => {
        const address = it.address || {};
        const cityName =
          address.city ||
          address.town ||
          address.village ||
          address.state ||
          it.display_name;
        const countryName = address.country as string | undefined;
        const lat = Number(it.lat);
        const lng = Number(it.lon);
        if (!cityName || Number.isNaN(lat) || Number.isNaN(lng)) return null;
        return {
          name: cityName as string,
          country: countryName,
          lat,
          lng,
        } as CityOut;
      })
      .filter(Boolean)
      // Deduplicate by name+country
      .reduce((acc: CityOut[], cur) => {
        if (
          !acc.find((x) => x.name === cur!.name && x.country === cur!.country)
        )
          acc.push(cur!);
        return acc;
      }, [])
      .slice(0, limit);

    // Save to cache
    cache.set(key, { expires: now + TTL_MS, data: items });
    return NextResponse.json({ cities: items });
  } catch {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
