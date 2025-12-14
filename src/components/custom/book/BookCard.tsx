import { Link } from "@/components/elements/Link";
import type { BookType } from "@/types/book";
import { ArrowLeft, BookOpen } from "lucide-react";
import Image from "next/image";
import Badge from "@/components/elements/Badge";

export default function BookCard({ book }: { book: BookType }) {
    return (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow dark:shadow-gray-900 hover:shadow-lg dark:hover:shadow-gray-800 transition flex flex-col h-full group">
            {/* Cover Image */}
            <div className="relative overflow-hidden rounded-t-xl bg-gray-100 dark:bg-gray-800">
                {/* Aspect Ratio Container - 3:4 for book covers */}
                <div className="relative w-full" style={{ aspectRatio: '3 / 4' }}>
                    {book.coverImage ? (
                        <Image
                            src={book.coverImage.url}
                            alt={book.coverImage.alternativeText || book.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-contain transition-all duration-300 group-hover:scale-105 p-2"
                            loading="lazy"
                            style={{ objectPosition: 'center' }}
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex flex-col items-center justify-center gap-3">
                            <BookOpen size={56} className="text-gray-400 dark:text-gray-500" />
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">لا توجد صورة</p>
                        </div>
                    )}
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 right-3 z-10">
                    <Badge
                        bg="bg-white/90 backdrop-blur-sm"
                        color="text-gray-800"
                        rounded="rounded-lg"
                        className="shadow-sm"
                    >
                        {book.category}
                    </Badge>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold mb-1 text-gray-900 dark:text-white line-clamp-2">
                    {book.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">{book.author}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {book.description.slice(0, 100)}...
                </p>

                {/* Metadata */}
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                        <BookOpen size={14} />
                        {book.pageCount} صفحة
                    </span>
                    <span>•</span>
                    <span>{book.publishedYear}</span>
                </div>

                {/* Link */}
                <div className="mt-auto">
                    <Link
                        href={`/books/${book.slug}`}
                        className="group/link inline-flex items-center gap-1.5 text-gray-700 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <span>عرض الكتاب</span>
                        <ArrowLeft
                            size={14}
                            className="relative top-[1px] transition-transform group-hover/link:translate-x-[-2px]"
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
}
