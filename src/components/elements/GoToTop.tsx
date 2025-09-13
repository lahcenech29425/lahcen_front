"use client";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function GoToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={handleClick}
      aria-label="Go to top"
      className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white rounded-full shadow-lg p-3 hover:cursor-pointer transition focus:outline-none"
    >
      <ArrowUp size={24} />
    </button>
  );
}