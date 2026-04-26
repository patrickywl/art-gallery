import { supabase } from "./supabase";

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export async function createInquiry(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  const { error } = await supabase.from("inquiries").insert(data);
  if (error) throw error;
}

export async function getInquiries(): Promise<Inquiry[]> {
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function markInquiryRead(id: string): Promise<void> {
  const { error } = await supabase
    .from("inquiries")
    .update({ is_read: true })
    .eq("id", id);

  if (error) throw error;
}
