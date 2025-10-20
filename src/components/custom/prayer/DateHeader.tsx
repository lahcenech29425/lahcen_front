"use client";
import React, { useEffect, useState } from "react";

type Props = {
  gregorian: { readable: string; date: string };
  hijri: { date: string; readable?: string };
  timezone: string;
};

export function DateHeader({ gregorian, hijri, timezone }: Props) {
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
    <div className="text-center space-y-3">
      <div className="text-2xl font-semibold">أوقات الصلاة اليوم</div>
      <div className="mx-auto w-64 rounded-md border-2 border-[#2a2a2a] bg-[#171717] px-4 py-2 text-white">
        <span className="block text-4xl font-bold tabular-nums">{now}</span>
      </div>
      <div className="mt-1 flex flex-col items-center gap-1 text-gray-400">
        <div className="text-base">{gregorian.readable}</div>
        <div className="text-base">{hijri.readable ?? hijri.date}</div>
        <div className="text-xs">{timezone}</div>
      </div>
    </div>
  );
}

export default DateHeader;
