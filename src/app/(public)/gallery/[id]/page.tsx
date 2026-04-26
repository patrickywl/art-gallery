import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArtwork, getArtworks } from "@/lib/artworks";
import InquireButton from "./InquireButton";
import type { Artwork } from "@/types";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artwork = await getArtwork(id).catch(() => null);
  if (!artwork) return { title: "작품을 찾을 수 없습니다" };
  return {
    title: `${artwork.title} | 성은공방`,
    description: artwork.description,
  };
}

export default async function ArtworkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let artwork;
  try {
    artwork = await getArtwork(id);
  } catch {
    notFound();
  }

  if (!artwork) notFound();

  let relatedArtworks: Artwork[] = [];
  try {
    const all = await getArtworks(artwork.category);
    relatedArtworks = all.filter((a) => a.id !== artwork.id).slice(0, 3);
  } catch {
    // ignore
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Link
        href="/gallery"
        className="inline-flex items-center text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
      >
        &larr; Art Gallery로 돌아가기
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
          <Image
            src={artwork.image_url}
            alt={artwork.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="flex flex-col justify-center">
          <span className="text-sm font-medium uppercase tracking-wider text-zinc-400">
            {artwork.category}
          </span>
          <h1 className="mt-2 text-4xl font-bold">{artwork.title}</h1>
          <p className="mt-6 leading-relaxed text-zinc-600 dark:text-zinc-300">
            {artwork.description}
          </p>
          <p className="mt-8 text-3xl font-semibold">
            ₩{artwork.price.toLocaleString()}
          </p>
          <InquireButton artworkTitle={artwork.title} />
        </div>
      </div>

      {relatedArtworks.length > 0 && (
        <section className="mt-20">
          <h2 className="text-xl font-semibold">
            {artwork.category} 카테고리 더보기
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedArtworks.map((related) => (
              <Link
                key={related.id}
                href={`/gallery/${related.id}`}
                className="group block overflow-hidden rounded-lg bg-zinc-50 dark:bg-zinc-900"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={related.image_url}
                    alt={related.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="33vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{related.title}</h3>
                  <p className="mt-1 text-sm text-zinc-500">
                    ₩{related.price.toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
