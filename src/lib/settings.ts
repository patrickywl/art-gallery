import { supabase } from "./supabase";
import type { SiteSettings } from "@/types";

const DEFAULTS: SiteSettings = {
  artist_name: "Artist Name",
  artist_bio:
    "Welcome to my gallery. I create unique artworks inspired by nature and emotion.",
  hero_image_url: "",
  contact_email: "hello@example.com",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase.from("site_settings").select("*");

  if (error || !data || data.length === 0) return DEFAULTS;

  const settings = { ...DEFAULTS };
  for (const row of data) {
    if (row.key in settings) {
      (settings as Record<string, string>)[row.key] = row.value;
    }
  }
  return settings;
}

export async function updateSiteSettings(
  updates: Partial<SiteSettings>
): Promise<void> {
  const entries = Object.entries(updates);
  for (const [key, value] of entries) {
    const { error } = await supabase
      .from("site_settings")
      .update({ value })
      .eq("key", key);

    if (error) throw error;
  }
}
