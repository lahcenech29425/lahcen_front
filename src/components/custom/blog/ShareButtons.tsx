"use client";
import React from 'react';
import { Facebook, Twitter, Linkedin, Link as LinkIcon, Share2 } from 'lucide-react';

export default function ShareButtons({ title, url }: { title: string; url: string }) {
    const shareLinks = [
        {
            name: 'Facebook',
            icon: Facebook,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            color: 'hover:bg-[#1877F2] hover:text-white'
        },
        {
            name: 'Twitter',
            icon: Twitter,
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
            color: 'hover:bg-[#1DA1F2] hover:text-white'
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
            color: 'hover:bg-[#0A66C2] hover:text-white'
        }
    ];

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        // Could add toast here
    };

    return (
        <div className="flex flex-col gap-3 sticky top-32">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-card flex items-center justify-center text-muted-foreground mb-2">
                <Share2 size={20} />
            </div>
            {shareLinks.map((link) => {
                const Icon = link.icon;
                return (
                    <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-10 h-10 rounded-full border border-gray-200 dark:border-border bg-white dark:bg-card text-gray-600 dark:text-gray-400 flex items-center justify-center transition-all duration-300 ${link.color}`}
                        aria-label={`Share on ${link.name}`}
                    >
                        <Icon size={18} />
                    </a>
                );
            })}
            <button
                onClick={copyToClipboard}
                className="w-10 h-10 rounded-full border border-gray-200 dark:border-border bg-white dark:bg-card text-gray-600 dark:text-gray-400 flex items-center justify-center transition-all duration-300 hover:bg-gray-800 hover:text-white dark:hover:bg-white dark:hover:text-black"
                aria-label="Copy Link"
            >
                <LinkIcon size={18} />
            </button>
        </div>
    );
}
