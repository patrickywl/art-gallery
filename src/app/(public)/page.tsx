import Image from "next/image";
import Link from "next/link";
import { getFeaturedArtworks } from "@/lib/artworks";
import { getSiteSettings } from "@/lib/settings";
import ArtworkCard from "@/components/ArtworkCard";
import type { Artwork } from "@/types";

export const revalidate = 60;

export default async function HomePage() {
  let artworks: Artwork[] = [];
  let settings = {
    artist_name: "Atelier",
    artist_bio:
      "Welcome to my gallery. I create unique artworks inspired by nature and emotion.",
    hero_image_url: "",
    contact_email: "",
  };

  try {
    [artworks, settings] = await Promise.all([
      getFeaturedArtworks(),
      getSiteSettings(),
    ]);
  } catch {
    // Supabase not configured yet — render with defaults
  }

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        {settings.hero_image_url && (
          <Image
            src={settings.hero_image_url}
            alt="Hero"
            fill
            className="object-cover opacity-40"
            priority
          />
        )}
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            {settings.artist_name}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
            {settings.artist_bio}
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/gallery"
              className="rounded-full bg-zinc-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              View Gallery
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-zinc-300 px-8 py-3 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Works */}
      {artworks.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Featured Works</h2>
            <Link
              href="/gallery"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
            >
              View all &rarr;
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {artworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state when Supabase is not configured */}
      {artworks.length === 0 && (
        <section className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2 className="text-2xl font-semibold">Featured Works</h2>
          <p className="mt-4 text-zinc-500">
            No artworks yet. Sign in to the admin panel to add your first piece.
          </p>
          <Link
            href="/admin/login"
            className="mt-6 inline-block rounded-full bg-zinc-900 px-6 py-2 text-sm font-medium text-white dark:bg-white dark:text-zinc-900"
          >
            Go to Admin
          </Link>
        </section>
      )}
    </>
  );
}
