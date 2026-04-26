import { supabase } from "./supabase";
import type { Artwork } from "@/types";

export async function getArtworks(category?: string): Promise<Artwork[]> {
  let query = supabase
    .from("artworks")
    .select("*")
    .order("created_at", { ascending: false });

  if (category && category !== "All") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getFeaturedArtworks(): Promise<Artwork[]> {
  const { data, error } = await supabase
    .from("artworks")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) throw error;
  return data ?? [];
}

export async function getArtwork(id: string): Promise<Artwork | null> {
  const { data, error } = await supabase
    .from("artworks")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function getCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from("artworks")
    .select("category")
    .order("category");

  if (error) throw error;
  const unique = [...new Set((data ?? []).map((d) => d.category))];
  return unique;
}

export async function createArtwork(
  artwork: Omit<Artwork, "id" | "created_at" | "updated_at">
): Promise<Artwork> {
  const { data, error } = await supabase
    .from("artworks")
    .insert(artwork)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateArtwork(
  id: string,
  updates: Partial<Omit<Artwork, "id" | "created_at" | "updated_at">>
): Promise<Artwork> {
  const { data, error } = await supabase
    .from("artworks")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteArtwork(id: string): Promise<void> {
  const { error } = await supabase.from("artworks").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadArtworkImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("artworks")
    .upload(fileName, file);

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from("artworks").getPublicUrl(fileName);

  return publicUrl;
}
