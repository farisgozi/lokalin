# Lokalin — Platform Eksplor UMKM Indonesia 

Platform berbasis web untuk menjelajahi, menemukan, dan mendukung UMKM lokal di Indonesia. Dibangun menggunakan **Next.js 15**, **Appwrite**, dan **Gemini AI**.

## Fitur Utama

- **Peta Interaktif** — Leaflet maps dengan marker UMKM, search, dan filter kategori
- **Pencarian Dinamis** — Search bar di navbar dan di peta dengan data real-time dari Appwrite
- **Sistem Rating** — User dapat memberikan rating bintang dan ulasan pada setiap UMKM
- **AI Analytics** — Analisis tren rating menggunakan Google Gemini AI
- **Dashboard Owner** — Kelola detail usaha, upload foto galeri, lihat statistik rating
- **Dashboard Admin** — Approve/reject pengajuan UMKM, input koordinat via Google Maps
- **Upload UMKM** — User biasa dapat mengajukan UMKM baru untuk direview admin
- **Autentikasi** — Login/register dengan email atau Google OAuth, role-based access

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Styling | TailwindCSS, Framer Motion |
| Backend | Appwrite (Auth, Database, Storage) |
| Maps | Leaflet + React-Leaflet |
| AI | Google Gemini API |
| Deploy | Vercel |

## Prerequisites

- Node.js 18+ (lihat `.nvmrc`)
- Akun [Appwrite Cloud](https://cloud.appwrite.io) atau self-hosted
- (Opsional) Google Cloud Console untuk OAuth
- (Opsional) Gemini API Key untuk fitur AI analytics

## Setup & Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/farisgozi/lokalin.git
cd lokalin
npm install
```

### 2. Konfigurasi Environment

Buat file `.env.local` di root project:

```env
# Appwrite
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=umkm-innovation-db
NEXT_PUBLIC_APPWRITE_UMKM_COLLECTION_ID=umkm
NEXT_PUBLIC_APPWRITE_SUGGESTIONS_COLLECTION_ID=umkm_suggestions
NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID=umkm-images

# Admin
NEXT_PUBLIC_ADMIN_EMAIL=admin@yourdomain.com

# Gemini AI (opsional)
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Setup Appwrite

Buat resource berikut di Appwrite Console:

**Database:** `umkm-innovation-db`

**Collections:**

| Collection | ID | Deskripsi |
|---|---|---|
| `umkm` | `umkm` | Data UMKM dari owner |
| `umkm_suggestions` | `umkm_suggestions` | Pengajuan UMKM dari user |

**Storage Bucket:**

| Bucket | ID | Permissions |
|---|---|---|
| UMKM Images | `umkm-images` | Users: Create, Read |

### 4. Setup Google OAuth (Opsional)

Ikuti panduan lengkap di [**GOOGLE_OAUTH_SETUP.md**](./GOOGLE_OAUTH_SETUP.md)

Singkatnya:
1. Buat OAuth Client ID di Google Cloud Console
2. Aktifkan Google provider di Appwrite Auth Settings
3. Paste Client ID + Secret

### 5. Jalankan Development Server

```bash
npm run dev
```

Buka http://localhost:3000

## Struktur Project

```
src/
├── app/
│   ├── api/ai/              # AI rating-trend API route
│   ├── auth/                # OAuth callback handler
│   ├── components/          # UI components
│   │   ├── layouts/         # Navbar, Sidebar, DashboardLayout
│   │   ├── maps/            # Leaflet MapComponent
│   │   ├── sections/        # Homepage sections
│   │   ├── ui/              # Reusable UI (RatingStars, SafeImage)
│   │   └── umkm-detail/     # Detail page components
│   ├── dashboard/
│   │   ├── admin/           # Admin approval dashboard
│   │   └── owner/           # Owner management dashboard
│   ├── data/                # Static UMKM data + rating system
│   ├── login/               # Login page
│   ├── onboarding/          # Owner UMKM registration
│   ├── register/            # Register page with role selection
│   └── umkm/
│       ├── [id]/            # Dynamic UMKM detail page
│       └── upload/          # User UMKM suggestion form
├── lib/
│   ├── appwrite/
│   │   ├── client.ts        # Appwrite Client, Account, Databases, Storage
│   │   └── database.ts      # Centralized data service (single source of truth)
│   └── auth/                # Auth types & service
└── fonts/                   # Custom ClashDisplay fonts
```

## Routes

| Route | Role | Deskripsi |
|-------|------|-----------|
| `/` | Public | Homepage dengan hero, explore, maps |
| `/login` | Public | Login email/password + Google |
| `/register` | Public | Register dengan pilihan role |
| `/umkm/[id]` | Public | Detail UMKM (gallery, rating, info) |
| `/umkm/upload` | User | Form pengajuan UMKM baru |
| `/onboarding` | Owner | Registrasi data UMKM (pertama kali) |
| `/dashboard/owner` | Owner | Kelola usaha, foto, lihat rating + AI |
| `/dashboard/admin` | Admin | Approve/reject pengajuan UMKM |
