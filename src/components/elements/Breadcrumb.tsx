"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import React from "react";

export type BreadcrumbItem = {
    label: string;
    href?: string;
};

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
    textColor?: string;
    showHomeLabel?: boolean;
}

export default function Breadcrumb({ items, className = "", textColor, showHomeLabel = true }: BreadcrumbProps) {
    const defaultColor = "text-[#232323] dark:text-[#ededed]";
    const colorClass = textColor || defaultColor;

    return (
        <nav className={`mb-8 flex items-center gap-4 text-sm ${colorClass} ${className}`}>
            {/* Home Link (Always present) */}
            <Link
                href="/"
                className="hover:opacity-80 transition flex items-center gap-1"
                aria-label="الرئيسية"
            >
                <Home size={16} />
                {/* Text label removed as per user request to only show icon */}
            </Link>

            {/* Dynamic Items */}
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                return (
                    <React.Fragment key={index}>
                        <span>/</span>
                        {item.href && !isLast ? (
                            <Link
                                href={item.href}
                                className="hover:opacity-80 transition"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="font-semibold">
                                {item.label}
                            </span>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
}
