"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    className,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    // Logic to determine which page numbers to show
    const getPageNumbers = () => {
        const delta = 1; // Number of pages to show around current page
        const range = [];
        const rangeWithDots: (number | string)[] = [];
        let l;

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                range.push(i);
            }
        }

        for (const i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push("...");
                }
            }
            rangeWithDots.push(i);
            l = i;
        }

        return rangeWithDots;
    };

    const pages = getPageNumbers();

    return (
        <div
            className={cn("flex items-center justify-center gap-2 select-none", className)}
            dir="rtl"
        >
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={cn(
                    "flex items-center gap-1 px-4 py-2.5 rounded-2xl transition-all duration-300 font-bold text-sm",
                    "bg-card border border-border/50 text-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary shadow-sm",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-card disabled:hover:text-foreground disabled:hover:border-border/50"
                )}
            >
                <ChevronRight size={18} />
                <span className="hidden sm:inline">السابق</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1.5 bg-card/50 backdrop-blur-sm p-1.5 rounded-2xl border border-border/50 shadow-inner">
                {pages.map((page, idx) => {
                    if (page === "...") {
                        return (
                            <div
                                key={`dots-${idx}`}
                                className="w-9 h-9 flex items-center justify-center text-muted-foreground"
                            >
                                <MoreHorizontal size={20} />
                            </div>
                        );
                    }

                    const pageNum = page as number;
                    const isActive = currentPage === pageNum;

                    return (
                        <button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            className={cn(
                                "min-w-10 h-10 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center",
                                isActive
                                    ? "bg-gradient-to-br from-[#8B4513] to-[#5d3119] text-white shadow-lg shadow-primary/25 scale-105"
                                    : "text-foreground/70 hover:bg-primary/10 hover:text-primary hover:scale-105"
                            )}
                        >
                            {pageNum}
                        </button>
                    );
                })}
            </div>

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={cn(
                    "flex items-center gap-1 px-4 py-2.5 rounded-2xl transition-all duration-300 font-bold text-sm",
                    "bg-card border border-border/50 text-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary shadow-sm",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-card disabled:hover:text-foreground disabled:hover:border-border/50"
                )}
            >
                <span className="hidden sm:inline">التالي</span>
                <ChevronLeft size={18} />
            </button>
        </div>
    );
}
