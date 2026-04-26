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
    artist_name: "성은공방",
    artist_bio: "자연과 감성에서 영감을 받은 도자기 작품을 만듭니다.",
    hero_image_url: "",
    contact_email: "",
  };

  try {
    [artworks, settings] = await Promise.all([
      getFeaturedArtworks(),
      getSiteSettings(),
    ]);
  } catch {
    // Supabase not configured yet
  }

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
        {settings.hero_image_url ? (
          <>
            <Image
              src={settings.hero_image_url}
              alt="메인 이미지"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black" />
        )}
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
            {settings.artist_name}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-zinc-300">
            {settings.artist_bio}
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/gallery"
              className="rounded-full bg-white px-8 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
            >
              Art Gallery 둘러보기
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/30 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              문의하기
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Works */}
      {artworks.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">추천 작품</h2>
            <Link
              href="/gallery"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
            >
              전체 보기 &rarr;
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {artworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
