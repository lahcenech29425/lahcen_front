import { fetchApi } from "@/utils/fetchApi";
import { normalizeBook, normalizeBooks } from "@/components/custom/book/normalizer";
import type { BookType } from "@/types/book";
import Image from "next/image";
import { Link } from "@/components/elements/Link";
import Badge from "@/components/elements/Badge";
import BookCard from "@/components/custom/book/BookCard";
import DownloadButton from "@/components/custom/book/DownloadButton";
import PageBreadcrumb from "@/components/elements/PageBreadcrumb";
import { BookOpen, Calendar, Download, User } from "lucide-react";

type Props = {
    params: Promise<{ slug: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Helper function to fetch book by slug
async function getBook(slug: string): Promise<BookType | null> {
    const res = await fetchApi(
        `/api/books?populate=*&filters[slug][$eq]=${slug}`
    );
    return res?.[0] ? normalizeBook(res[0]) : null;
}

/**
 * Generate SEO metadata for the book page
 */
export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const book = await getBook(slug);

    if (!book) return {};

    const imageUrl = book.coverImage?.url ?? undefined;

    return {
        title: `${book.title} | المكتبة الإسلامية`,
        description: book.description.slice(0, 160),
        keywords: [book.category, book.author, "كتاب إسلامي", "تحميل كتاب"],
        openGraph: {
            title: book.title,
            description: book.description.slice(0, 160),
            url: `https://www.lahcenway.com/books/${book.slug}`,
            type: "book",
            images: imageUrl ? [imageUrl] : undefined,
            authors: [book.author],
        },
        twitter: {
            card: "summary_large_image",
            title: book.title,
            description: book.description.slice(0, 160),
            images: imageUrl ? [imageUrl] : undefined,
        },
        alternates: {
            canonical: `https://www.lahcenway.com/books/${book.slug}`,
        },
    };
}

export default async function BookDetailPage({ params }: Props) {
    const { slug } = await params;
    const book = await getBook(slug);

    if (!book) {
        return (
            <div className="max-w-2xl mx-auto py-20 text-center text-gray-500 dark:text-gray-400">
                الكتاب غير موجود.
            </div>
        );
    }

    // Fetch recommended books (same category, exclude current)
    const recommendedRes = await fetchApi(
        `/api/books?populate=*&filters[slug][$ne]=${slug}&filters[category][$eq]=${encodeURIComponent(book.category)}&pagination[limit]=4`
    );
    const recommendations: BookType[] = recommendedRes
        ? normalizeBooks(recommendedRes)
        : [];

    // If not enough books in same category, fetch any other books
    if (recommendations.length < 3) {
        const moreRes = await fetchApi(
            `/api/books?populate=*&filters[slug][$ne]=${slug}&pagination[limit]=4`
        );
        const moreBooks: BookType[] = moreRes ? normalizeBooks(moreRes) : [];
        // Merge and remove duplicates
        const existingIds = new Set(recommendations.map((b) => b.id));
        for (const b of moreBooks) {
            if (!existingIds.has(b.id) && recommendations.length < 4) {
                recommendations.push(b);
            }
        }
    }

    return (
        <div className="min-h-screen bg-background font-sans pb-24">
            {/* Background Pattern */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-primary"
                style={{
                    maskImage: "url('/assets/bg.svg')",
                    WebkitMaskImage: "url('/assets/bg.svg')",
                    maskRepeat: "repeat",
                }}
            />

            <PageBreadcrumb
                items={[
                    { label: "المكتبة", href: "/books" },
                    { label: book.title }
                ]}
                onDarkBackground={false}
            />

            <div className="relative z-10 max-w-7xl mx-auto px-4">
                {/* Book Detail */}
                <article className="pb-16 bg-card rounded-xl max-w-7xl mx-auto transition-colors">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {/* Cover Image */}
                        <div className="md:col-span-1">
                            <div className="sticky top-6">
                                {book.coverImage ? (
                                    <div className="relative w-full bg-secondary rounded-xl shadow-xl overflow-hidden" style={{ aspectRatio: '3 / 4' }}>
                                        <Image
                                            src={book.coverImage.url}
                                            alt={book.coverImage.alternativeText || book.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            className="object-contain p-4"
                                            style={{ objectPosition: 'center' }}
                                            priority
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full aspect-[3/4] bg-gradient-to-br from-secondary/50 to-secondary rounded-xl shadow-xl flex flex-col items-center justify-center gap-3">
                                        <BookOpen size={64} className="text-gray-400 dark:text-gray-500" />
                                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">لا توجد صورة</p>
                                    </div>
                                )}

                                {/* Download Button (Desktop) */}
                                <div className="hidden md:block mt-6">
                                    <DownloadButton book={book} />
                                </div>
                            </div>
                        </div>

                        {/* Book Info */}
                        <div className="md:col-span-2">
                            {/* Category Badge */}
                            <Badge
                                bg="bg-primary/10"
                                color="text-primary"
                                rounded="rounded-lg"
                                className="mb-4"
                            >
                                {book.category}
                            </Badge>

                            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                {book.title}
                            </h1>

                            {/* Author */}
                            <div className="flex items-center gap-2 text-muted-foreground mb-6">
                                <User size={18} />
                                <span className="text-lg">{book.author}</span>
                            </div>

                            {/* Metadata Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <div className="bg-card border border-border rounded-xl p-4 text-center transition-colors">
                                    <BookOpen size={24} className="mx-auto text-primary mb-2" />
                                    <div className="text-2xl font-bold text-foreground">{book.pageCount}</div>
                                    <div className="text-sm text-muted-foreground">صفحة</div>
                                </div>
                                <div className="bg-card border border-border rounded-xl p-4 text-center transition-colors">
                                    <Calendar size={24} className="mx-auto text-primary mb-2" />
                                    <div className="text-2xl font-bold text-foreground">{book.publishedYear}</div>
                                    <div className="text-sm text-muted-foreground">سنة النشر</div>
                                </div>
                                <div className="bg-card border border-border rounded-xl p-4 text-center transition-colors">
                                    <Download size={24} className="mx-auto text-primary mb-2" />
                                    <div className="text-2xl font-bold text-foreground">{book.downloadCount || 0}</div>
                                    <div className="text-sm text-muted-foreground">تحميل</div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                                    <span className="inline-block w-1 h-6 bg-primary rounded-sm" />
                                    عن الكتاب
                                </h2>
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                    {book.description}
                                </p>
                            </div>

                            {/* Download Button (Mobile) */}
                            <div className="md:hidden">
                                <DownloadButton book={book} />
                            </div>
                        </div>
                    </div>
                </article>

                {/* Recommended Books */}
                {recommendations.length > 0 && (
                    <section className="mt-10 mb-20">
                        <div className="max-w-7xl mx-auto bg-card rounded-2xl shadow-md p-6 md:p-8 transition-colors">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-foreground flex items-center gap-3">
                                    <span
                                        className="inline-block w-1.5 h-8 bg-primary rounded-sm"
                                        aria-hidden
                                    />
                                    كتب مقترحة
                                </h2>

                                {recommendations.length > 3 && (
                                    <Link
                                        href="/books"
                                        className="ml-4 inline-flex items-center gap-2 text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow hover:shadow-lg hover:bg-primary/90 transition transform hover:-translate-y-0.5"
                                    >
                                        عرض المزيد
                                    </Link>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                {recommendations.slice(0, 4).map((b) => (
                                    <div
                                        key={b.id}
                                        className="transition-transform hover:scale-[1.01]"
                                    >
                                        <BookCard book={b} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
