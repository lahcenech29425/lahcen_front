// Types for Quran Audio feature — CDN-based surah audio

/** A single edition available on the Islamic Network CDN */
export interface SurahAudioEdition {
  /** CDN folder name, e.g. "ar.alafasy" */
  id: string;
  /** Arabic display name */
  arabicName: string;
  /** English display name */
  englishName: string;
  /** Optional recitation style label */
  style?: string;
}

// ─── Legacy types kept for backward-compat with existing imports ───

export interface Reciter {
  id: number;
  reciter_name: string;
  style: string | null;
  translated_name: {
    name: string;
    language_name: string;
  };
}

export interface ReciterWithArabic extends Reciter {
  arabic_name: string;
}

export interface AudioFile {
  id: number;
  chapter_id: number;
  file_size: number;
  format: string;
  audio_url: string;
}

export interface ChapterRecitation {
  audio_file: AudioFile;
}

export type RecitationStyle = "Murattal" | "Mujawwad" | "Muallim" | null;

// Arabic names mapping for reciters (legacy Quran.com API compat)
export const RECITER_ARABIC_NAMES: Record<string, string> = {
  "AbdulBaset AbdulSamad": "عبد الباسط عبد الصمد",
  "Abdur-Rahman as-Sudais": "عبد الرحمن السديس",
  "Abu Bakr al-Shatri": "أبو بكر الشاطري",
  "Hani ar-Rifai": "هاني الرفاعي",
  "Mahmoud Khalil Al-Husary": "محمود خليل الحصري",
  "Mishari Rashid al-`Afasy": "مشاري راشد العفاسي",
  "Mohamed Siddiq al-Minshawi": "محمد صديق المنشاوي",
  "Sa`ud ash-Shuraym": "سعود الشريم",
  "Mohamed al-Tablawi": "محمد الطبلاوي",
};

// Style translations
export const STYLE_ARABIC: Record<string, string> = {
  Murattal: "مرتل",
  Mujawwad: "مجود",
  Muallim: "معلم",
};

// ─── Curated list of popular reciters on the CDN ───

export const SURAH_AUDIO_EDITIONS: SurahAudioEdition[] = [
  // ── Top reciters ──
  {
    id: "ar.alafasy",
    arabicName: "مشاري راشد العفاسي",
    englishName: "Mishary Rashid Alafasy",
  },
  {
    id: "ar.abdulbasitmurattal",
    arabicName: "عبد الباسط عبد الصمد",
    englishName: "Abdul Basit Abdul Samad",
    style: "مرتل",
  },
  {
    id: "ar.abdulbasitmujawwad",
    arabicName: "عبد الباسط عبد الصمد",
    englishName: "Abdul Basit Abdul Samad",
    style: "مجود",
  },
  {
    id: "ar.muhammadsiddiqalminshawimujawwad",
    arabicName: "محمد صديق المنشاوي",
    englishName: "Mohamed Siddiq Al-Minshawi",
    style: "مجود",
  },
  {
    id: "ar.aliabdurrahmanalhuthaify",
    arabicName: "علي عبد الرحمن الحذيفي",
    englishName: "Ali Abdur-Rahman Al-Huthaify",
  },
  {
    id: "ar.saudalshuraim",
    arabicName: "سعود الشريم",
    englishName: "Saud Ash-Shuraim",
  },
  {
    id: "ar.sudaisshuraymnaeemsultan",
    arabicName: "السديس والشريم ونعيم سلطان",
    englishName: "As-Sudais, Ash-Shuraim & Naeem Sultan",
  },
  {
    id: "ar.haniarrifai",
    arabicName: "هاني الرفاعي",
    englishName: "Hani Ar-Rifai",
  },
  {
    id: "ar.mohamedtablawi",
    arabicName: "محمد الطبلاوي",
    englishName: "Mohamed Al-Tablawi",
  },
  {
    id: "ar.muhammadayyub",
    arabicName: "محمد أيوب",
    englishName: "Muhammad Ayyub",
  },
  // ── Popular reciters ──
  {
    id: "ar.nasseralqatami",
    arabicName: "ناصر القطامي",
    englishName: "Nasser Al-Qatami",
  },
  {
    id: "ar.ahmedalajmi",
    arabicName: "أحمد العجمي",
    englishName: "Ahmed Al-Ajmi",
  },
  {
    id: "ar.ibrahimaldossari",
    arabicName: "إبراهيم الدوسري",
    englishName: "Ibrahim Al-Dossari",
  },
  {
    id: "ar.yasseraldossari",
    arabicName: "ياسر الدوسري",
    englishName: "Yasser Al-Dossari",
  },
  {
    id: "ar.salahalbudair",
    arabicName: "صلاح البدير",
    englishName: "Salah Al-Budair",
  },
  {
    id: "ar.bandarbalila",
    arabicName: "بندر بليلة",
    englishName: "Bandar Balila",
  },
  {
    id: "ar.adilkalbani",
    arabicName: "عادل الكلباني",
    englishName: "Adil Kalbani",
  },
  {
    id: "ar.khaledalqahtani",
    arabicName: "خالد القحطاني",
    englishName: "Khaled Al-Qahtani",
  },
  {
    id: "ar.khalifaaltunaiji",
    arabicName: "خليفة الطنيجي",
    englishName: "Khalifa Al-Tunaiji",
  },
  {
    id: "ar.mahmoodalrifai",
    arabicName: "محمود الرفاعي",
    englishName: "Mahmoud Al-Rifai",
  },
  {
    id: "ar.abdullahalmatrood",
    arabicName: "عبد الله المطرود",
    englishName: "Abdullah Al-Matrood",
  },
  {
    id: "ar.abdullahbasfar",
    arabicName: "عبد الله بصفر",
    englishName: "Abdullah Basfar",
  },
  {
    id: "ar.abdullahawadaljuhani",
    arabicName: "عبد الله عواد الجهني",
    englishName: "Abdullah Awad Al-Juhani",
  },
  {
    id: "ar.abdullahkhayat",
    arabicName: "عبد الله خياط",
    englishName: "Abdullah Khayat",
  },
  {
    id: "ar.khalidaljalil",
    arabicName: "خالد الجليل",
    englishName: "Khalid Al-Jalil",
  },
  {
    id: "ar.khalidalmohanna",
    arabicName: "خالد المهنا",
    englishName: "Khalid Al-Mohanna",
  },
  { id: "ar.faresabbad", arabicName: "فارس عباد", englishName: "Fares Abbad" },
  {
    id: "ar.mahmoudalialbanna",
    arabicName: "محمود علي البنا",
    englishName: "Mahmoud Ali Al-Banna",
  },
  {
    id: "ar.nabilarrifai",
    arabicName: "نبيل الرفاعي",
    englishName: "Nabil Ar-Rifai",
  },
  {
    id: "ar.emadalmansary",
    arabicName: "عماد المنصاري",
    englishName: "Emad Al-Mansary",
  },
  {
    id: "ar.jamaanalosaimi",
    arabicName: "جمعان العصيمي",
    englishName: "Jamaan Al-Osaimi",
  },
  {
    id: "ar.ahmadalnufais",
    arabicName: "أحمد النفيس",
    englishName: "Ahmad Al-Nufais",
  },
  {
    id: "ar.muhammadalmehysni",
    arabicName: "محمد المحيسني",
    englishName: "Muhammad Al-Mehysni",
  },
  {
    id: "ar.muhammadalluhaidan",
    arabicName: "محمد اللحيدان",
    englishName: "Muhammad Al-Luhaidan",
  },
  // ── More reciters ──
  {
    id: "ar.abdulazizazzahrani",
    arabicName: "عبد العزيز الزهراني",
    englishName: "Abdul Aziz Az-Zahrani",
  },
  {
    id: "ar.abdulbariaththubaity",
    arabicName: "عبد الباري الثبيتي",
    englishName: "Abdul Bari Ath-Thubaity",
  },
  {
    id: "ar.abdulmuhsinalqasim",
    arabicName: "عبد المحسن القاسم",
    englishName: "Abdul Muhsin Al-Qasim",
  },
  {
    id: "ar.abdulkareemalhazmi",
    arabicName: "عبد الكريم الحازمي",
    englishName: "Abdul Kareem Al-Hazmi",
  },
  {
    id: "ar.muhammadalsubayyil",
    arabicName: "محمد السبيل",
    englishName: "Muhammad Al-Subayyil",
  },
  {
    id: "ar.tawfeeqassayegh",
    arabicName: "توفيق الصائغ",
    englishName: "Tawfeeq As-Sayegh",
  },
  { id: "ar.yahyahawwa", arabicName: "يحيى حوى", englishName: "Yahya Hawwa" },
  { id: "ar.hatemfarid", arabicName: "حاتم فريد", englishName: "Hatem Farid" },
  {
    id: "ar.waleedidreesalmaneese",
    arabicName: "وليد إدريس المنيسي",
    englishName: "Waleed Idrees Al-Maneese",
  },
  { id: "ar.obeikan", arabicName: "العبيكان", englishName: "Al-Obeikan" },
  {
    id: "ar.ibrahimaljormy",
    arabicName: "إبراهيم الجرمي",
    englishName: "Ibrahim Al-Jormy",
  },
  {
    id: "ar.salahbaothman",
    arabicName: "صلاح بو خاطر",
    englishName: "Salah Bu Khater",
  },
  { id: "ar.aymanswed", arabicName: "أيمن سويد", englishName: "Ayman Swed" },
  {
    id: "ar.mohamedhassan",
    arabicName: "محمد حسان",
    englishName: "Mohamed Hassan",
  },
  {
    id: "ar.yousufalshoaey",
    arabicName: "يوسف الشويعي",
    englishName: "Yousuf Al-Shoaey",
  },
  {
    id: "ar.sayedramadan",
    arabicName: "سيد رمضان",
    englishName: "Sayed Ramadan",
  },
];
