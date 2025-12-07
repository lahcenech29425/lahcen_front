"use client";

import { useState } from "react";
import type { BookType } from "@/types/book";
import { Download, Loader2, Eye } from "lucide-react";

interface DownloadButtonProps {
    book: BookType;
}

export default function DownloadButton({ book }: DownloadButtonProps) {
    // Parse as number to avoid string concatenation
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadCount, setDownloadCount] = useState(Number(book.downloadCount) || 0);

    const handleView = () => {
        if (!book.pdfFile?.url) return;
        // Open PDF in new tab without counting as download
        window.open(book.pdfFile.url, "_blank");
    };

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

            // Use Next.js API route to proxy download (hides backend URL)
            const downloadUrl = `/api/download?url=${encodeURIComponent(book.pdfFile.url)}&filename=${encodeURIComponent(book.title + '.pdf')}`;

            // Create a temporary link and trigger download
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `${book.title}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading PDF:", error);
            // Fallback: try to open in new tab if download fails
            window.open(book.pdfFile.url, "_blank");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-2">
                {/* View Button */}
                <button
                    onClick={handleView}
                    disabled={!book.pdfFile?.url}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium flex-1"
                >
                    <Eye size={20} />
                    مشاهدة الكتاب
                </button>

                {/* Download Button */}
                <button
                    onClick={handleDownload}
                    disabled={isDownloading || !book.pdfFile?.url}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium flex-1"
                >
                    {isDownloading ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            جاري التحميل...
                        </>
                    ) : (
                        <>
                            <Download size={20} />
                            تحميل
                        </>
                    )}
                </button>
            </div>
            <span className="text-sm text-gray-500 text-center">
                تم التحميل {downloadCount} مرة
            </span>
        </div>
    );
}
