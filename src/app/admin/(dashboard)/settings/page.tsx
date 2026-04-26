"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getSiteSettings, updateSiteSettings } from "@/lib/settings";
import { uploadArtworkImage } from "@/lib/artworks";
import type { SiteSettings } from "@/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    artist_name: "",
    artist_bio: "",
    hero_image_url: "",
    contact_email: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getSiteSettings()
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadArtworkImage(file);
      setSettings((s) => ({ ...s, hero_image_url: url }));
    } catch {
      setMessage("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await updateSiteSettings(settings);
      setMessage("Settings saved successfully");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
        Loading...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Site Settings</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Customize how your gallery appears to visitors
      </p>

      <form onSubmit={handleSave} className="mt-8 max-w-2xl space-y-6">
        {message && (
          <div
            className={`rounded-lg p-3 text-sm ${
              message.includes("success")
                ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            {message}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium">Artist Name</label>
          <input
            type="text"
            value={settings.artist_name}
            onChange={(e) =>
              setSettings({ ...settings, artist_name: e.target.value })
            }
            className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Bio / About</label>
          <textarea
            rows={4}
            value={settings.artist_bio}
            onChange={(e) =>
              setSettings({ ...settings, artist_bio: e.target.value })
            }
            className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Contact Email</label>
          <input
            type="email"
            value={settings.contact_email}
            onChange={(e) =>
              setSettings({ ...settings, contact_email: e.target.value })
            }
            className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Hero Image</label>
          {settings.hero_image_url && (
            <div className="relative mt-2 h-40 w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <Image
                src={settings.hero_image_url}
                alt="Hero"
                fill
                className="object-cover"
                sizes="640px"
              />
            </div>
          )}
          <div className="mt-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 text-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">
              {uploading ? "Uploading..." : "Change Hero Image"}
              <input
                type="file"
                accept="image/*"
                onChange={handleHeroUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
