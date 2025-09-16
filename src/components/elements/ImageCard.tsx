import React from "react";
import Image from "next/image";

type ImageType = {
  url: string;
  alternativeText?: string;
};

export default function ImageCard({ image }: { image: ImageType }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-100 flex flex-col h-full overflow-hidden group">
      <div className="relative w-full h-72 bg-gray-100 overflow-hidden">
        <Image
          src={image.url}
          alt={image.alternativeText || "Quran page"}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={false}
          loading="lazy"
        />
      </div>
    </div>
  );
}
