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
      style={{
        position: "fixed",
        bottom: "32px",
        right: "32px",
        zIndex: 50,
        width: "56px",
        height: "56px",
      }}
      className="bg-primary text-primary-foreground rounded-full shadow-2xl hover:bg-primary/90 hover:shadow-primary/40 transition-all duration-300 focus:outline-none flex items-center justify-center transform hover:-translate-y-2 hover:scale-110 border-4 border-background/20 backdrop-blur-md"
    >
      <ArrowUp size={24} strokeWidth={3} />
    </button>
  );
}

