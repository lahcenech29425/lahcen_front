"use client";

import { useState, useEffect, useRef } from "react";
import { Check } from "lucide-react";

const THEMES = [
    {
        id: "light",
        name: "نور",
        colors: { bg: "#FFFFFF", primary: "#D4AF37", accent: "#F5E1A4" }
    },
    {
        id: "dark",
        name: "ليل",
        colors: { bg: "#1a1512", primary: "#b8865a", accent: "#3a3028" }
    },
    {
        id: "sepia",
        name: "كتاب",
        colors: { bg: "#FDF6E3", primary: "#8B4513", accent: "#D2B48C" }
    },
    {
        id: "ocean",
        name: "محيط",
        colors: { bg: "#E0F7FA", primary: "#00BCD4", accent: "#FF5722" }
    },
    {
        id: "forest",
        name: "غابة",
        colors: { bg: "#F0F4F0", primary: "#7CB342", accent: "#FFA000" }
    },
    {
        id: "sunset",
        name: "غروب",
        colors: { bg: "#FFF0F5", primary: "#FF6F61", accent: "#FFB6C1" }
    },
    {
        id: "royal",
        name: "ملكي",
        colors: { bg: "#F5F0FF", primary: "#7B1FA2", accent: "#D4AF37" }
    },
];

export default function ThemeSwitcher() {
    const [currentTheme, setCurrentTheme] = useState("light");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load theme from localStorage
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme && THEMES.some(t => t.id === savedTheme)) {
            setCurrentTheme(savedTheme);
            applyTheme(savedTheme);
        }
    }, []);

    useEffect(() => {
        // Close dropdown when clicking outside
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const applyTheme = (themeId: string) => {
        const root = document.documentElement;
        root.setAttribute("data-theme", themeId);

        // Handle .dark class for compatibility
        if (themeId === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }

        localStorage.setItem("theme", themeId);
    };

    const handleThemeChange = (themeId: string) => {
        setCurrentTheme(themeId);
        applyTheme(themeId);
        setIsOpen(false);
    };


    const currentThemeData = THEMES.find(t => t.id === currentTheme) || THEMES[0];

    return (
        <div className="w-full" ref={dropdownRef}>
            {/* Simple Text Link */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full px-4 py-3 text-foreground hover:bg-primary/10 transition-colors rounded-lg group"
            >
                <span className="font-medium">اختر السمة</span>
                <span className="text-sm opacity-60">{currentThemeData.name}</span>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="mt-2 bg-background border border-primary/20 rounded-xl shadow-lg overflow-hidden">
                    <div className="p-2 space-y-1">
                        {THEMES.map((theme) => (
                            <button
                                key={theme.id}
                                onClick={() => handleThemeChange(theme.id)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all hover:bg-primary/10 ${currentTheme === theme.id ? "bg-primary/10" : ""
                                    }`}
                            >
                                {/* Theme Name */}
                                <span className="font-medium text-foreground">{theme.name}</span>

                                {/* Color Preview Circles */}
                                <div className="flex gap-1.5">
                                    <div
                                        className="w-4 h-4 rounded-full border border-foreground/20"
                                        style={{ backgroundColor: theme.colors.primary }}
                                    />
                                    <div
                                        className="w-4 h-4 rounded-full border border-foreground/20"
                                        style={{ backgroundColor: theme.colors.accent }}
                                    />
                                </div>

                                {/* Check Mark */}
                                {currentTheme === theme.id && (
                                    <Check size={16} className="text-primary" strokeWidth={3} />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
