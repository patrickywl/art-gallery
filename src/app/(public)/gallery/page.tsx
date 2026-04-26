import { getArtworks, getCategories } from "@/lib/artworks";
import GalleryClient from "./GalleryClient";
import type { Artwork } from "@/types";

export const revalidate = 60;

export const metadata = {
  title: "Art Gallery | 성은공방",
  description: "성은공방의 모든 작품을 둘러보세요.",
};

export default async function GalleryPage() {
  let artworks: Artwork[] = [];
  let categories: string[] = [];

  try {
    [artworks, categories] = await Promise.all([
      getArtworks(),
      getCategories(),
    ]);
  } catch {
    // Supabase not configured
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold">Art Gallery</h1>
      <p className="mt-2 text-zinc-500">모든 작품을 둘러보세요.</p>

      <GalleryClient initialArtworks={artworks} categories={categories} />
    </div>
  );
}
