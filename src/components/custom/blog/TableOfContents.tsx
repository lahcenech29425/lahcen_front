"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TOCItem {
    id: string;
    text: string;
    level: number;
}

export default function TableOfContents({ content }: { content: string }) {
    const [headings, setHeadings] = useState<TOCItem[]>([]);
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        // Parse markdown headers (simple regex for #, ##, ###)
        // This assumes standard markdown. Ideally we parse the rendered HTML, 
        // but since we pass raw content, we regex it or DOM traverse if rendered.
        // The MarkdownRenderer renders IDs for headers? We might need to ensure that.

        // Better approach: Query selector on the article content
        const article = document.getElementById("article-content");
        if (!article) return;

        const elements = Array.from(article.querySelectorAll("h2, h3"));
        const items = elements.map((elem, index) => {
            if (!elem.id) elem.id = `heading-${index}`;
            return {
                id: elem.id,
                text: elem.textContent || "",
                level: Number(elem.tagName.charAt(1))
            };
        });
        setHeadings(items);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "0% 0% -80% 0%" }
        );

        elements.forEach((elem) => observer.observe(elem));
        return () => observer.disconnect();
    }, [content]);

    if (headings.length === 0) return null;

    return (
        <div className="sticky top-32 p-6 bg-card/50 backdrop-blur-md rounded-2xl border border-border">
            <nav className="flex flex-col gap-1">
                {headings.map((heading) => (
                    <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        className={`text-sm py-1.5 transition-colors duration-200 block ${heading.level === 3 ? "mr-4" : ""
                            } ${activeId === heading.id
                                ? "text-primary font-bold"
                                : "text-muted-foreground hover:text-primary"
                            }`}
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(heading.id)?.scrollIntoView({ behavior: "smooth" });
                            setActiveId(heading.id);
                        }}
                    >
                        {heading.text}
                    </a>
                ))}
            </nav>
        </div>
    );
}
