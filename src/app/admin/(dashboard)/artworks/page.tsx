"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getArtworks, deleteArtwork } from "@/lib/artworks";
import type { Artwork } from "@/types";

export default function AdminArtworksPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data = await getArtworks();
      setArtworks(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteArtwork(id);
      setArtworks((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Artworks</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Manage your gallery collection
          </p>
        </div>
        <Link
          href="/admin/artworks/new"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          + Add Artwork
        </Link>
      </div>

      {loading ? (
        <div className="mt-8 flex items-center gap-2 text-sm text-zinc-400">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
          Loading...
        </div>
      ) : artworks.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-zinc-400">No artworks yet.</p>
          <Link
            href="/admin/artworks/new"
            className="mt-4 inline-block text-sm font-medium text-zinc-900 underline dark:text-white"
          >
            Add your first artwork
          </Link>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3 font-medium">Image</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Featured</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {artworks.map((artwork) => (
                <tr key={artwork.id}>
                  <td className="px-4 py-3">
                    {artwork.image_url ? (
                      <div className="relative h-12 w-12 overflow-hidden rounded bg-zinc-100 dark:bg-zinc-800">
                        <Image
                          src={artwork.image_url}
                          alt={artwork.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
                        ?
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{artwork.title}</td>
                  <td className="px-4 py-3 text-zinc-500">
                    {artwork.category}
                  </td>
                  <td className="px-4 py-3">
                    ${artwork.price.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {artwork.is_featured ? (
                      <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
                        Yes
                      </span>
                    ) : (
                      <span className="text-zinc-400">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/artworks/${artwork.id}/edit`}
                        className="rounded px-2 py-1 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(artwork.id, artwork.title)}
                        className="rounded px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
