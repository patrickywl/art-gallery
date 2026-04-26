"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { uploadArtworkImage } from "@/lib/artworks";
import type { Artwork } from "@/types";

type FormData = Omit<Artwork, "id" | "created_at" | "updated_at">;

const CATEGORIES = [
  "도자기",
  "접시/그릇",
  "화병",
  "찻잔/다기",
  "생활자기",
  "장식품",
  "조각",
  "기타",
];

export default function ArtworkForm({
  initialData,
  onSubmit,
  submitLabel,
}: {
  initialData?: Partial<FormData>;
  onSubmit: (data: FormData) => Promise<void>;
  submitLabel: string;
}) {
  const [form, setForm] = useState<FormData>({
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    price: initialData?.price ?? 0,
    category: initialData?.category ?? "도자기",
    image_url: initialData?.image_url ?? "",
    is_featured: initialData?.is_featured ?? false,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleImageUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 업로드할 수 있습니다.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const url = await uploadArtworkImage(file);
      setForm((f) => ({ ...f, image_url: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleImageUpload(file);
    },
    [handleImageUpload]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("작품명을 입력해주세요.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium">이미지</label>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`mt-1 flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
            dragOver
              ? "border-zinc-900 bg-zinc-50 dark:border-white dark:bg-zinc-900"
              : "border-zinc-300 hover:border-zinc-400 dark:border-zinc-700"
          }`}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          {uploading ? (
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
              업로드 중...
            </div>
          ) : form.image_url ? (
            <div className="relative h-48 w-full">
              <Image
                src={form.image_url}
                alt="미리보기"
                fill
                className="rounded-lg object-contain"
                sizes="640px"
              />
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                이미지를 드래그하거나 클릭하여 업로드
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                PNG, JPG, WebP (최대 5MB)
              </p>
            </div>
          )}
        </div>
        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">작품명</label>
        <input
          type="text"
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">설명</label>
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-white"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">카테고리</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-white"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">가격 (₩)</label>
          <input
            type="number"
            min="0"
            step="1000"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: parseFloat(e.target.value) || 0 })
            }
            className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_featured"
          checked={form.is_featured}
          onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
          className="h-4 w-4 rounded border-zinc-300"
        />
        <label htmlFor="is_featured" className="text-sm">
          홈페이지 추천 작품으로 표시
        </label>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {saving ? "저장 중..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
