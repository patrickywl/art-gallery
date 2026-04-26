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
    if (!confirm(`"${title}"을(를) 삭제하시겠습니까? 되돌릴 수 없습니다.`))
      return;
    try {
      await deleteArtwork(id);
      setArtworks((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "삭제에 실패했습니다.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">작품 관리</h1>
          <p className="mt-1 text-sm text-zinc-500">
            갤러리 컬렉션을 관리하세요
          </p>
        </div>
        <Link
          href="/admin/artworks/new"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          + 새 작품 등록
        </Link>
      </div>

      {loading ? (
        <div className="mt-8 flex items-center gap-2 text-sm text-zinc-400">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
          불러오는 중...
        </div>
      ) : artworks.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-zinc-400">등록된 작품이 없습니다.</p>
          <Link
            href="/admin/artworks/new"
            className="mt-4 inline-block text-sm font-medium text-zinc-900 underline dark:text-white"
          >
            첫 작품 등록하기
          </Link>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3 font-medium">이미지</th>
                <th className="px-4 py-3 font-medium">작품명</th>
                <th className="px-4 py-3 font-medium">카테고리</th>
                <th className="px-4 py-3 font-medium">가격</th>
                <th className="px-4 py-3 font-medium">추천</th>
                <th className="px-4 py-3 font-medium">관리</th>
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
                    ₩{artwork.price.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {artwork.is_featured ? (
                      <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
                        예
                      </span>
                    ) : (
                      <span className="text-zinc-400">아니오</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/artworks/${artwork.id}/edit`}
                        className="rounded px-2 py-1 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                      >
                        수정
                      </Link>
                      <button
                        onClick={() => handleDelete(artwork.id, artwork.title)}
                        className="rounded px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        삭제
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
