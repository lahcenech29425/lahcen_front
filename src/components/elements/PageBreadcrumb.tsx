"use client";

import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface PageBreadcrumbProps {
    items: BreadcrumbItem[];
    onDarkBackground?: boolean;
    className?: string;
}

export default function PageBreadcrumb({
    items,
    onDarkBackground = false,
    className,
}: PageBreadcrumbProps) {
    return (
        <nav
            aria-label="Breadcrumb"
            className={cn(
                "py-4 px-4 md:px-8",
                className
            )}
        >
            <ol className="flex items-center gap-2 flex-wrap text-sm">
                {/* Home Link */}
                <li>
                    <Link
                        href="/"
                        className={cn(
                            "flex items-center gap-1 transition-colors",
                            onDarkBackground
                                ? "text-white/70 hover:text-white"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Home size={16} />
                        <span>الرئيسية</span>
                    </Link>
                </li>

                {items.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                        <ChevronLeft
                            size={14}
                            className={cn(
                                onDarkBackground
                                    ? "text-white/50"
                                    : "text-muted-foreground/50"
                            )}
                        />
                        {item.href ? (
                            <Link
                                href={item.href}
                                className={cn(
                                    "transition-colors",
                                    onDarkBackground
                                        ? "text-white/70 hover:text-white"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span
                                className={cn(
                                    "font-medium",
                                    onDarkBackground
                                        ? "text-white"
                                        : "text-foreground"
                                )}
                            >
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
