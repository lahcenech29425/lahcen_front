"use client";
import { Moon, Sun, Wrench } from "lucide-react";
import { useState, useEffect } from "react";

interface MaintenancePageProps {
    title?: string;
    message?: string;
}

export default function MaintenancePage({
    title = "الموقع تحت الصيانة",
    message = "نحن نعمل على تحسين الموقع. يرجى العودة لاحقاً."
}: MaintenancePageProps) {
    // Themes: 'light', 'dark', 'brown'
    const [theme, setTheme] = useState<string>("brown");

    useEffect(() => {
        // Initialize theme from local storage or system preference
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setTheme(savedTheme);
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            setTheme("dark");
        }
    }, []);

    useEffect(() => {
        // Apply theme to document
        const root = document.documentElement;
        root.setAttribute("data-theme", theme);

        // Handle tailwind .dark class for compatibility
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }

        localStorage.setItem("theme", theme);
    }, [theme]);

    const cycleTheme = () => {
        const themes = ["light", "dark", "brown"];
        const nextIndex = (themes.indexOf(theme) + 1) % themes.length;
        setTheme(themes[nextIndex]);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground transition-colors duration-500">
            {/* Top Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />

            {/* Theme Toggle Button */}
            <button
                onClick={cycleTheme}
                className="absolute top-6 left-6 p-3 rounded-full bg-white/10 hover:bg-black/5 dark:hover:bg-white/10 backdrop-blur-sm border border-primary/20 text-primary shadow-lg transition-all hover:scale-110 active:scale-95"
                title={`Current Theme: ${theme}`}
            >
                {theme === "light" && <Sun size={24} />}
                {theme === "dark" && <Moon size={24} />}
                {theme === "brown" && <div className="w-5 h-5 rounded-full bg-[#8B4513] border-2 border-white ring-1 ring-[#8B4513]" />}
            </button>

            {/* Main content */}
            <div className="text-center px-6 max-w-lg relative z-10">
                {/* Icon */}
                <div className="mb-8 animate-pulse">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-primary rounded-full shadow-2xl shadow-primary/30">
                        <Wrench size={48} className="text-primary-foreground" strokeWidth={1.5} />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight font-heading">
                    {title}
                </h1>

                {/* Message */}
                <p className="text-lg md:text-xl opacity-80 mb-10 leading-relaxed font-body">
                    {message}
                </p>

                {/* Divider / Decoration */}
                <div className="w-24 h-1 bg-primary mx-auto rounded-full opacity-50" />
            </div>

            {/* Background Pattern (Optional) */}
            <div className="absolute inset-0 z-0 opacity-5 pointer-events-none bg-[url('/assets/bg.svg')] bg-center bg-repeat mix-blend-multiply dark:mix-blend-overlay" />
        </div>
    );
}
