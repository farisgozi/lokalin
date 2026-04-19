# UMKM Kita

Platform eksplor UMKM berbasis Next.js dengan tambahan fitur:
- Auth Appwrite (login/register role user/owner/admin)
- Dashboard owner (fokus rating trend + AI analysis Gemini)
- Dashboard admin (approve/reject upload UMKM)
- Upload UMKM oleh pengguna biasa (pending approval)

## Setup Environment

Buat file `.env.local` di root project:

```bash
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=YOUR_APPWRITE_PROJECT_ID
NEXT_PUBLIC_ADMIN_EMAIL=admin@yourdomain.com

GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

## Menjalankan Project

```bash
npm install
npm run dev
```

App default: http://localhost:3000

## Route Baru

- `/register` → daftar akun user / owner
- `/login` → login Appwrite
- `/dashboard` → auto redirect berdasarkan role
- `/dashboard/owner` → rating trend + AI analisis
- `/dashboard/admin` → approval pengajuan UMKM
- `/umkm/upload` → form upload UMKM oleh user biasa

## Catatan Implementasi Saat Ini

- Approval upload UMKM masih disimpan di `localStorage` (MVP) untuk mempercepat iterasi UI + flow.
- Endpoint AI menggunakan Gemini via route API Next di `/api/ai/rating-trend`.
- Jika `GEMINI_API_KEY` belum diisi, sistem pakai fallback analisis statistik sederhana.
