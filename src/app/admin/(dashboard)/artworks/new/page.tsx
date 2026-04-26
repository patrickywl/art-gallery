"use client";

import { useRouter } from "next/navigation";
import { createArtwork } from "@/lib/artworks";
import ArtworkForm from "@/components/ArtworkForm";

export default function NewArtworkPage() {
  const router = useRouter();

  return (
    <div>
      <h1 className="text-2xl font-bold">새 작품 등록</h1>
      <p className="mt-1 text-sm text-zinc-500">
        이미지를 업로드하고 정보를 입력하세요
      </p>

      <div className="mt-8">
        <ArtworkForm
          submitLabel="작품 등록"
          onSubmit={async (data) => {
            await createArtwork(data);
            router.push("/admin/artworks");
          }}
        />
      </div>
    </div>
  );
}
