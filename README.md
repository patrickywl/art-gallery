# Atelier - Art Gallery with Datadog Browser RUM

A sample e-commerce art gallery site built with Next.js, Supabase, and Datadog Browser RUM. Designed for artists to showcase and sell their work, with an admin panel for non-technical users to manage content.

## Architecture

| Layer | Technology | Free Tier |
|-------|-----------|-----------|
| Frontend + API | Next.js 16 on Vercel | 100GB bandwidth |
| Database | Supabase PostgreSQL | 500MB |
| File Storage | Supabase Storage | 1GB |
| Authentication | Supabase Auth | 50K MAU |
| Monitoring | Datadog Browser RUM | Trial / existing account |

## Setup

### 1. Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Open the SQL Editor and run the contents of `supabase-schema.sql`.
3. Go to **Storage** and create a public bucket named `artworks`.
4. Go to **Authentication > Users** and create your admin user (email + password).
5. Copy your project URL and anon key from **Settings > API**.

### 2. Datadog RUM Application

1. In Datadog, go to **UX Monitoring > RUM Applications > New Application**.
2. Choose "JS" as the application type.
3. Copy the `applicationId` and `clientToken`.
4. Note your Datadog site (e.g. `datadoghq.com`, `us5.datadoghq.com`).

### 3. Local Development

```bash
cd art-gallery
cp .env.local.example .env.local
# Fill in the values in .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the gallery.
Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the admin panel.

### 4. Deploy to Vercel

1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and import the repository.
   - Set the **Root Directory** to `art-gallery` if the repo root is not the Next.js project.
3. Add all environment variables from `.env.local.example` in the Vercel project settings.
4. Deploy.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous (public) key |
| `NEXT_PUBLIC_DD_APPLICATION_ID` | Datadog RUM application ID |
| `NEXT_PUBLIC_DD_CLIENT_TOKEN` | Datadog RUM client token |
| `NEXT_PUBLIC_DD_SITE` | Datadog site (default: `datadoghq.com`) |
| `NEXT_PUBLIC_DD_SERVICE` | Service name in Datadog (default: `art-gallery`) |
| `NEXT_PUBLIC_DD_ENV` | Environment tag (default: `production`) |

## Features

### Public Pages
- **Home**: Hero section with artist intro and featured artworks
- **Gallery**: Filterable artwork grid by category
- **Artwork Detail**: Full image, description, price, inquiry link
- **Contact**: Form with subject pre-fill from artwork pages

### Admin Panel (`/admin`)
- Dashboard with artwork stats
- Artwork CRUD with drag-and-drop image upload
- Site settings (artist name, bio, hero image, contact email)
- Protected by Supabase Auth

### Datadog RUM Tracking
- Page load performance (Core Web Vitals: LCP, FID, CLS)
- Session Replay (100% sample rate)
- JavaScript error tracking via Error Boundary
- Custom actions: `artwork_click`, `gallery_filter`, `artwork_inquire`, `contact_form_submit`, `page_view`
- Resource timing for API calls
- Long task detection
