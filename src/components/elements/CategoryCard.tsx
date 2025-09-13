import React from "react";
import { Category } from "@/types/category";
import Image from "next/image";
import { Link } from "@/components/elements/Link";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col h-full">
      <div className="relative w-full h-48 bg-gray-100">
        {category.image?.url && (
          <Image
            src={category.image.url}
            alt={category.image.alternativeText || category.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
          />
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
          {category.name}
        </h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {category.description}
        </p>
        <Link
          href={`/categories/${category.slug}`}
          className="mt-auto inline-block text-primary font-medium hover:underline text-sm"
        >
          Voir les produits
        </Link>
      </div>
    </div>
  );
}
