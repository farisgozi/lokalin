# Appwrite Database Setup Guide

## Prerequisites
- Appwrite Console access at your `NEXT_PUBLIC_APPWRITE_ENDPOINT`
- Project ID: `NEXT_PUBLIC_APPWRITE_PROJECT_ID`

## Step 1: Create Database

1. Go to **Databases** in Appwrite Console
2. Click **Create Database** → Name: `umkm-kita`
3. Copy the **Database ID**

## Step 2: Create Collections

### Collection: `umkm`

| Attribute | Type | Required | Array | Default |
|-----------|------|----------|-------|---------|
| `name` | string(255) | ✅ | | |
| `category` | string(100) | ✅ | | |
| `description` | string(5000) | ✅ | | |
| `address` | string(500) | ✅ | | |
| `phone` | string(20) | ✅ | | |
| `images` | string(500) | | ✅ | |
| `latitude` | float | | | |
| `longitude` | float | | | |
| `status` | enum: PENDING, APPROVED, REJECTED | ✅ | | PENDING |
| `rejection_reason` | string(1000) | | | |
| `owner_id` | string(36) | ✅ | | |
| `submitted_at` | datetime | ✅ | | |
| `approved_at` | datetime | | | |
| `open_hours` | string(100) | | | |
| `social_media` | string(255) | | | |

### Collection: `umkm_suggestions`

| Attribute | Type | Required | Array | Default |
|-----------|------|----------|-------|---------|
| `name` | string(255) | ✅ | | |
| `category` | string(100) | ✅ | | |
| `description` | string(5000) | ✅ | | |
| `address` | string(500) | ✅ | | |
| `phone` | string(20) | ✅ | | |
| `images` | string(500) | | ✅ | |
| `submitted_by` | string(36) | ✅ | | |
| `status` | enum: PENDING, APPROVED, REJECTED | ✅ | | PENDING |
| `rejection_reason` | string(1000) | | | |
| `submitted_at` | datetime | ✅ | | |
| `latitude` | float | | | |
| `longitude` | float | | | |

## Step 3: Set Permissions

### `umkm` Collection
- **Any** → Read (so pinpoints show on homepage)
- **Users** → Create (owner submits)
- **Users** → Update (admin updates status)

### `umkm_suggestions` Collection
- **Any** → Read
- **Users** → Create (user submits suggestion)
- **Users** → Update (admin updates status)

## Step 4: Create Indexes

### `umkm`
- Index on `status` (key) — for filtering approved UMKM
- Index on `owner_id` (key) — for owner dashboard queries

### `umkm_suggestions`
- Index on `status` (key)

## Step 5: Add Environment Variables

```env
NEXT_PUBLIC_APPWRITE_DATABASE_ID=<your-database-id>
NEXT_PUBLIC_APPWRITE_UMKM_COLLECTION_ID=<umkm-collection-id>
NEXT_PUBLIC_APPWRITE_SUGGESTIONS_COLLECTION_ID=<suggestions-collection-id>
```

## Note
Until these env vars are set, the app uses **localStorage** as fallback. This is sufficient for demo/MVP but not for production.
