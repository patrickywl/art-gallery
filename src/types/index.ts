export interface Artwork {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

export interface SiteSettings {
  artist_name: string;
  artist_bio: string;
  hero_image_url: string;
  contact_email: string;
}
