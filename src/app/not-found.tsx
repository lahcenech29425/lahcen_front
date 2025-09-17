"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4"
      dir="rtl"
      lang="ar"
    >
      <div className="max-w-xl w-full text-center space-y-8">
        <div className="mx-auto w-36 h-36 flex items-center justify-center rounded-full bg-white/5 shadow-inner">
          <ShieldAlert className="w-16 h-16 text-white" />
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold leading-tight">
            عذراً — الصفحة غير موجودة
          </h1>
          <p className="mt-2 text-gray-300">
            الصفحة المطلوبة غير موجودة أو تم نقلها. اضغط الزر أدناه للعودة إلى
            الصفحة الرئيسية.
          </p>
        </div>

        <div>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-md font-medium shadow hover:scale-105 transition"
            aria-label="العودة إلى الصفحة الرئيسية"
          >
            العودة إلى الرئيسية
          </Link>
        </div>
        <div className="mt-2 text-sm text-gray-400">
          إذا احتجت مساعدة، تواصل معنا عبر وسائل التواصل الاجتماعي.
        </div>
        <p className="text-xs text-gray-500 mt-6">
          © {new Date().getFullYear()} لحسن — جميع الحقوق محفوظة
        </p>
      </div>
    </div>
  );
}
