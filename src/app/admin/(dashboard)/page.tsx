"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Stats {
  totalArtworks: number;
  featuredCount: number;
  categories: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalArtworks: 0,
    featuredCount: 0,
    categories: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data: artworks } = await supabase
          .from("artworks")
          .select("id, is_featured, category");

        if (artworks) {
          const cats = new Set(artworks.map((a) => a.category));
          setStats({
            totalArtworks: artworks.length,
            featuredCount: artworks.filter((a) => a.is_featured).length,
            categories: cats.size,
          });
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Artworks", value: stats.totalArtworks },
    { label: "Featured", value: stats.featuredCount },
    { label: "Categories", value: stats.categories },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Overview of your gallery content
      </p>

      {loading ? (
        <div className="mt-8 flex items-center gap-2 text-sm text-zinc-400">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
          Loading...
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800"
              >
                <p className="text-sm text-zinc-500">{card.label}</p>
                <p className="mt-2 text-3xl font-bold">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/admin/artworks/new"
              className="inline-flex items-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              + Add New Artwork
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
