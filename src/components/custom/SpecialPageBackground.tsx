"use client";
import React from "react";

export default function SpecialPageBackground() {
    return (
        <>
            <style jsx global>{`
        /* Hide default global background on these pages */
        body::before, body::after {
          opacity: 0 !important;
          display: none !important;
        }
      `}</style>
            <div
                className="fixed inset-0 z-[-1] pointer-events-none flex items-center justify-center"
                aria-hidden="true"
            >
                {/* Gold Masked Background */}
                <div
                    className="absolute inset-0 bg-[#D4AF37] opacity-[0.08] dark:opacity-[0.12]"
                    style={{
                        maskImage: "url('/assets/bg1.svg')",
                        maskRepeat: "no-repeat",
                        maskPosition: "center center",
                        maskSize: "cover",
                        WebkitMaskImage: "url('/assets/bg1.svg')",
                        WebkitMaskRepeat: "no-repeat",
                        WebkitMaskPosition: "center center",
                        WebkitMaskSize: "cover"
                    }}
                />
            </div>
        </>
    );
}
