# Google OAuth Setup Guide

## Step 1: Google Cloud Console

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create or select a project
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Application type: **Web application**
6. Authorized redirect URIs:
   ```
   https://syd.cloud.appwrite.io/v1/account/sessions/oauth2/callback/google/6861b5e20027ba386475
   ```
   *(Replace with your Appwrite endpoint and project ID if different)*
7. Copy the **Client ID** and **Client Secret**

## Step 2: Appwrite Console

1. Go to your Appwrite Console → Project → **Auth** → **Settings**
2. Scroll to **OAuth Providers** → Find **Google**
3. Toggle **Enable**
4. Paste the **Client ID** and **Client Secret** from Step 1
5. Save

## Step 3: Verify

1. Run `npm run dev`
2. Go to `/register`, select a role, click "Daftar dengan Google"
3. Complete Google sign-in
4. You should be redirected to `/auth/callback` → then to `/onboarding` (for owners) or `/dashboard` (for users)

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| 401 | Google OAuth not enabled in Appwrite | Complete Step 2 |
| redirect_uri_mismatch | Wrong redirect URI in Google Console | Update URI per Step 1.6 |
| popup_closed | User closed Google popup | User must complete sign-in |

## How Role Selection Works

When a user clicks "Daftar dengan Google" on the Register page:
1. The selected role (user/owner) is saved to `localStorage` key `oauth-pending-role`
2. Google OAuth popup opens via Appwrite
3. After successful auth, `/auth/callback` reads the pending role
4. Role is set as Appwrite user prefs
5. For existing accounts (login), the role from prefs is used
