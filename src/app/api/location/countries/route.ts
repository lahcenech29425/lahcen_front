import { NextResponse } from "next/server";

type RestCountry = {
  name?: { common?: string };
  cca2?: string;
  translations?: { ara?: { common?: string } };
};

type CountryOut = { code: string; nameEn: string; nameAr: string };

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,cca2,translations",
      { next: { revalidate: 60 * 60 } }
    );
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch countries" },
        { status: 502 }
      );
    }
    const data: RestCountry[] = await res.json();
    const countries: CountryOut[] = data
      .map((c) => {
        const nameEn = c?.name?.common as string | undefined;
        const nameAr = c?.translations?.ara?.common as string | undefined;
        const code = c?.cca2 as string | undefined;
        if (!nameEn || !code) return null;
        return { code, nameEn, nameAr: nameAr ?? nameEn };
      })
      .filter(Boolean)
      .sort((a, b) => a!.nameAr.localeCompare(b!.nameAr, "ar")) as CountryOut[];

    return NextResponse.json({ countries });
  } catch {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
