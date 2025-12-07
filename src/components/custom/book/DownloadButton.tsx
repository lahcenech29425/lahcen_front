"use client";

import { useState } from "react";
import type { BookType } from "@/types/book";
import { Download, Loader2 } from "lucide-react";

interface DownloadButtonProps {
    book: BookType;
}

export default function DownloadButton({ book }: DownloadButtonProps) {
    // Parse as number to avoid string concatenation
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadCount, setDownloadCount] = useState(Number(book.downloadCount) || 0);

    const handleDownload = async () => {
        if (!book.pdfFile?.url || isDownloading) return;

        setIsDownloading(true);

        // Calculate new count as a number
        const newCount = downloadCount + 1;

        try {
            // Update download count in Strapi
            const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
            await fetch(`${baseUrl}/api/books/${book.documentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    data: {
                        downloadCount: newCount,
                    },
                }),
            });

            // Update local state
            setDownloadCount(newCount);

            // Open PDF in new tab for download
            window.open(book.pdfFile.url, "_blank");
        } catch (error) {
            console.error("Error updating download count:", error);
            // Still open the PDF even if count update fails
            window.open(book.pdfFile?.url, "_blank");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <button
                onClick={handleDownload}
                disabled={isDownloading || !book.pdfFile?.url}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
                {isDownloading ? (
                    <>
                        <Loader2 size={20} className="animate-spin" />
                        جاري التحميل...
                    </>
                ) : (
                    <>
                        <Download size={20} />
                        تحميل الكتاب
                    </>
                )}
            </button>
            <span className="text-sm text-gray-500 text-center">
                تم التحميل {downloadCount} مرة
            </span>
        </div>
    );
}
