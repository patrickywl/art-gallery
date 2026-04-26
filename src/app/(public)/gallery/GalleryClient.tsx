"use client";

import { useState } from "react";
import { datadogRum } from "@datadog/browser-rum";
import ArtworkCard from "@/components/ArtworkCard";
import type { Artwork } from "@/types";

export default function GalleryClient({
  initialArtworks,
  categories,
}: {
  initialArtworks: Artwork[];
  categories: string[];
}) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered =
    selectedCategory === "All"
      ? initialArtworks
      : initialArtworks.filter((a) => a.category === selectedCategory);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    datadogRum.addAction("gallery_filter", { category: cat });
  };

  return (
    <>
      {/* Category filter */}
      {categories.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                selectedCategory === cat
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center text-zinc-400">
          No artworks found in this category.
        </p>
      )}
    </>
  );
}
