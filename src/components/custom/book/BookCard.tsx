import { Link } from "@/components/elements/Link";
import type { BookType } from "@/types/book";
import { ArrowLeft, BookOpen } from "lucide-react";
import Image from "next/image";
import Badge from "@/components/elements/Badge";

export default function BookCard({ book }: { book: BookType }) {
    return (
        <div className="bg-white rounded-xl shadow hover:shadow-lg transition flex flex-col h-full group">
            {/* Cover Image */}
            <div className="relative overflow-hidden rounded-t-xl">
                {book.coverImage ? (
                    <Image
                        src={book.coverImage.url}
                        alt={book.coverImage.alternativeText || book.title}
                        width={book.coverImage.width || 300}
                        height={book.coverImage.height || 400}
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <BookOpen size={48} className="text-gray-400" />
                    </div>
                )}
                {/* Category Badge */}
                <div className="absolute top-3 right-3">
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
                <h3 className="text-lg font-bold mb-1 text-gray-900 line-clamp-2">
                    {book.title}
                </h3>
                <p className="text-gray-500 text-sm mb-3">{book.author}</p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {book.description.slice(0, 100)}...
                </p>

                {/* Metadata */}
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
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
                        className="group/link inline-flex items-center gap-1.5 text-gray-700 font-medium hover:text-gray-900 transition-colors"
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
