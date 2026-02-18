import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://mp3quran.net/api/v3";

/**
 * Proxy the mp3quran.net v3 reciters API.
 * Avoids CORS issues and enables ISR caching.
 */
export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;

    const params = new URLSearchParams();
    params.set("language", searchParams.get("language") ?? "ar");

    const reciter = searchParams.get("reciter");
    if (reciter) params.set("reciter", reciter);

    const rewaya = searchParams.get("rewaya");
    if (rewaya) params.set("rewaya", rewaya);

    const sura = searchParams.get("sura");
    if (sura) params.set("sura", sura);

    try {
        const res = await fetch(`${API_BASE}/reciters?${params.toString()}`, {
            next: { revalidate: 3600 },
        });

        if (!res.ok) {
            return NextResponse.json(
                { error: `Upstream API error: ${res.status}` },
                { status: res.status },
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error proxying mp3quran API:", error);
        return NextResponse.json(
            { error: "Failed to fetch reciters" },
            { status: 500 },
        );
    }
}
