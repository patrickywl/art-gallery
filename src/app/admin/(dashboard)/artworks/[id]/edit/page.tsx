"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getArtwork, updateArtwork } from "@/lib/artworks";
import ArtworkForm from "@/components/ArtworkForm";
import type { Artwork } from "@/types";

export default function EditArtworkPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArtwork(id)
      .then((data) => {
        if (!data) router.replace("/admin/artworks");
        else setArtwork(data);
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
        불러오는 중...
      </div>
    );
  }

  if (!artwork) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold">작품 수정</h1>
      <p className="mt-1 text-sm text-zinc-500">
        &quot;{artwork.title}&quot; 수정
      </p>

      <div className="mt-8">
        <ArtworkForm
          initialData={artwork}
          submitLabel="변경 저장"
          onSubmit={async (data) => {
            await updateArtwork(id, data);
            router.push("/admin/artworks");
          }}
        />
      </div>
    </div>
  );
}
