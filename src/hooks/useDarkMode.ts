"use client";

import { useEffect, useState } from "react";

export function useDarkMode() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Initial check
        const checkDarkMode = () => {
            setIsDark(document.documentElement.classList.contains("dark"));
        };

        checkDarkMode();

        // Observer for class changes on html element
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (
                    mutation.type === "attributes" &&
                    mutation.attributeName === "class"
                ) {
                    checkDarkMode();
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    return isDark;
}
