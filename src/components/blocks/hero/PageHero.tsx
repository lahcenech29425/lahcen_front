"use client";

import { ReactNode } from "react";
import Breadcrumb from "@/components/elements/Breadcrumb";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface PageHeroProps {
    /** Background image URL */
    backgroundImage: string;
    /** Overlay darkness, e.g. "bg-black/50" */
    overlayClass?: string;
    /** Background position, e.g. "bg-center" | "bg-bottom" */
    bgPosition?: string;
    /** Hero height classes, e.g. "h-[520px] md:h-[600px]" */
    heightClass?: string;
    /** Breadcrumb items */
    breadcrumbs?: BreadcrumbItem[];
    /** Whether to show the home icon in breadcrumb */
    showHomeLabel?: boolean;
    /** Main content rendered inside the hero (centered) */
    children: ReactNode;
    /** dir attribute */
    dir?: "rtl" | "ltr";
}

/**
 * Reusable full-width hero section with:
 * - Background image + overlay
 * - Breadcrumb row (below fixed header)
 * - Centered content slot
 */
export default function PageHero({
    backgroundImage,
    overlayClass = "bg-black/50",
    bgPosition = "bg-bottom",
    heightClass = "h-[520px] md:h-[600px]",
    breadcrumbs,
    showHomeLabel = false,
    children,
    dir = "rtl",
}: PageHeroProps) {
    return (
        <div
            className={`relative w-full ${heightClass} overflow-hidden flex flex-col`}
            dir={dir}
        >
            {/* Background */}
            <div
                className={`absolute inset-0 bg-cover ${bgPosition}`}
                style={{ backgroundImage: `url('${backgroundImage}')` }}
            >
                <div className={`absolute inset-0 ${overlayClass}`} />
            </div>

            {/* Breadcrumb — below fixed header */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <div className="relative z-20 pt-28 px-4 md:px-8 max-w-7xl w-full mx-auto">
                    <div className="bg-black/20 backdrop-blur-sm inline-block px-4 py-2 rounded-lg border border-white/10">
                        <Breadcrumb
                            items={breadcrumbs}
                            textColor="text-white"
                            showHomeLabel={showHomeLabel}
                            className="!mb-0"
                        />
                    </div>
                </div>
            )}

            {/* Content — fills remaining space */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 md:px-8 max-w-7xl w-full mx-auto">
                {children}
            </div>
        </div>
    );
}
