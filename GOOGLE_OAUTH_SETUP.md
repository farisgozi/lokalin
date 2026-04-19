# Panduan Setup Google OAuth

## Langkah 1: Google Cloud Console

1. Buka https://console.cloud.google.com  
2. Buat atau pilih project  
3. Masuk ke **APIs & Services** → **Credentials**  
4. Klik **Create Credentials** → **OAuth client ID**  
5. Tipe aplikasi: **Web application**  
6. Authorized redirect URIs:
https://syd.cloud.appwrite.io/v1/account/sessions/oauth2/callback/google/6861b5e20027ba386475
*(Ganti dengan endpoint Appwrite dan Project ID milikmu jika berbeda)*  
7. Salin **Client ID** dan **Client Secret**

## Langkah 2: Appwrite Console

1. Buka Appwrite Console → Project → **Auth** → **Settings**  
2. Scroll ke bagian **OAuth Providers** → cari **Google**  
3. Aktifkan (**Enable**)  
4. Tempelkan **Client ID** dan **Client Secret** dari Langkah 1  
5. Simpan

## Langkah 3: Verifikasi

1. Jalankan `npm run dev`  
2. Buka `/register`, pilih role, lalu klik **"Daftar dengan Google"**  
3. Selesaikan proses login Google  
4. Kamu akan diarahkan ke `/auth/callback` → lalu ke:
- `/onboarding` (untuk owner)  
- `/dashboard` (untuk user)

## Troubleshooting

| Error | Penyebab | Solusi |
|------|--------|--------|
| 401 | Google OAuth belum diaktifkan di Appwrite | Selesaikan Langkah 2 |
| redirect_uri_mismatch | Redirect URI salah di Google Console | Perbaiki URI sesuai Langkah 1.6 |
| popup_closed | User menutup popup Google | User harus menyelesaikan login |

## Cara Kerja Pemilihan Role

Saat user klik **"Daftar dengan Google"** di halaman Register:

1. Role yang dipilih (user/owner) disimpan ke `localStorage` dengan key `oauth-pending-role`  
2. Popup Google OAuth terbuka melalui Appwrite  
3. Setelah autentikasi berhasil, `/auth/callback` membaca role yang tersimpan  
4. Role disimpan sebagai **preferences user di Appwrite**  
5. Jika akun sudah ada (login), maka role diambil dari preferences tersebut  