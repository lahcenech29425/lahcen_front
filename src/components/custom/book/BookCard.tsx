"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Calendar, ArrowUpRight, Star } from "lucide-react";
import type { BookType } from "@/types/book";

interface BookCardProps {
  book: BookType;
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/books/${book.slug}`} className="group relative block h-full">
      {/* Card Container */}
      <div className="relative h-full bg-card rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
        {/* Image Section */}
        <div className="relative h-[240px] w-full bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10 flex items-center justify-center p-6 overflow-hidden">
          {/* Decorative Pattern Background */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "url('/assets/bg.svg')",
              backgroundPosition: "center",
              backgroundRepeat: "repeat",
              backgroundSize: "100px",
            }}
          />

          {/* Category Badge - Top Right */}
          <div className="absolute top-3 right-3 z-10">
            <span className="px-3 py-1 text-xs font-bold text-primary bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
              {book.category}
            </span>
          </div>

          {/* Shadow for depth */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-2/3 h-3 bg-black/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* The Actual Book Image */}
          <div className="relative w-[130px] h-[180px] shadow-2xl shadow-black/20 transform transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2">
            {book.coverImage ? (
              <Image
                src={book.coverImage.url}
                alt={book.title}
                fill
                className="object-cover rounded-r-lg rounded-l-sm"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center rounded-r-lg rounded-l-sm text-primary-foreground">
                <BookOpen size={48} className="opacity-70" />
              </div>
            )}
            {/* Book Spine Effect */}
            <div className="absolute top-0 left-0 w-[8px] h-full bg-gradient-to-r from-white/40 via-white/20 to-transparent z-10" />
            <div className="absolute top-0 left-0 w-[2px] h-full bg-black/30 z-10" />

            {/* Shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-r-lg" />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-5 flex flex-col justify-between relative bg-card">
          <div className="flex-1">
            <h3
              className="text-lg font-bold font-momken text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors"
              title={book.title}
            >
              {book.title}
            </h3>
            <p className="text-sm text-muted-foreground font-medium line-clamp-1 mb-1">
              {book.author}
            </p>
          </div>

          {/* Footer with Meta Info */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <BookOpen size={13} />
                <span className="font-medium">{book.pageCount}</span>
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={13} />
                <span className="font-medium">{book.publishedYear}</span>
              </span>
            </div>

            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-sm">
              <ArrowUpRight
                size={18}
                className="group-hover:rotate-45 transition-transform duration-300"
              />
            </div>
          </div>
        </div>

        {/* Subtle border glow on hover */}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent group-hover:ring-primary/20 pointer-events-none transition-all duration-300" />
      </div>
    </Link>
  );
}
