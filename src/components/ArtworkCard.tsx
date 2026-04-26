"use client";

import Image from "next/image";
import Link from "next/link";
import { datadogRum } from "@datadog/browser-rum";
import type { Artwork } from "@/types";

export default function ArtworkCard({ artwork }: { artwork: Artwork }) {
  const handleClick = () => {
    datadogRum.addAction("artwork_click", {
      artwork_id: artwork.id,
      artwork_title: artwork.title,
      artwork_category: artwork.category,
    });
  };

  return (
    <Link
      href={`/gallery/${artwork.id}`}
      onClick={handleClick}
      className="group block overflow-hidden rounded-lg bg-zinc-50 transition-shadow hover:shadow-lg dark:bg-zinc-900"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={artwork.image_url}
          alt={artwork.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-zinc-900 dark:text-white">
          {artwork.title}
        </h3>
        <p className="mt-1 text-sm text-zinc-500">{artwork.category}</p>
        <p className="mt-2 text-lg font-semibold text-zinc-900 dark:text-white">
          ₩{artwork.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
