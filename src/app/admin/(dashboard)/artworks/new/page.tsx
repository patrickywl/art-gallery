"use client";

import { useRouter } from "next/navigation";
import { createArtwork } from "@/lib/artworks";
import ArtworkForm from "@/components/ArtworkForm";

export default function NewArtworkPage() {
  const router = useRouter();

  return (
    <div>
      <h1 className="text-2xl font-bold">Add New Artwork</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Upload an image and fill in the details
      </p>

      <div className="mt-8">
        <ArtworkForm
          submitLabel="Create Artwork"
          onSubmit={async (data) => {
            await createArtwork(data);
            router.push("/admin/artworks");
          }}
        />
      </div>
    </div>
  );
}
