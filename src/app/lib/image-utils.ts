// Utility function untuk handle gambar UMKM
export function getImagePath(imagePath: string, fallback: string = 'https://syd.cloud.appwrite.io/v1/storage/buckets/umkm-images/files/umkm-placeholder/view?project=6861b5e20027ba386475&mode=admin'): string {
  // Daftar gambar yang pasti ada
  const availableImages = [
    'https://syd.cloud.appwrite.io/v1/storage/buckets/umkm-images/files/umkm-Bakmi/view?project=6861b5e20027ba386475&mode=admin',
    'https://syd.cloud.appwrite.io/v1/storage/buckets/umkm-images/files/umkm-ayamGeprek77/view?project=6861b5e20027ba386475&mode=admin',
    'https://syd.cloud.appwrite.io/v1/storage/buckets/umkm-images/files/umkm-baramCafe-produk/view?project=6861b5e20027ba386475&mode=admin',
    'https://syd.cloud.appwrite.io/v1/storage/buckets/umkm-images/files/umkm-cerita/view?project=6861b5e20027ba386475&mode=admin',
    'https://syd.cloud.appwrite.io/v1/storage/buckets/umkm-images/files/umkm-geprek-cikini/view?project=6861b5e20027ba386475&mode=admin',
    ''
  ];

  // Jika gambar ada dalam daftar, return path asli
  if (availableImages.includes(imagePath)) {
    return imagePath;
  }

  // Jika tidak, return fallback
  return fallback;
}

export function getAvatarPath(avatarPath: string, fallback: string = 'https://syd.cloud.appwrite.io/v1/storage/buckets/avatar-images/files/6918c2fd00230c92263c/view?project=6861b5e20027ba386475&mode=admin'): string {
  const availableAvatars = [
    'https://syd.cloud.appwrite.io/v1/storage/buckets/avatar-images/files/6918c2fd00230c92263c/view?project=6861b5e20027ba386475&mode=admin',
    'https://syd.cloud.appwrite.io/v1/storage/buckets/avatar-images/files/6918c304002295e53a62/view?project=6861b5e20027ba386475&mode=admin',
    'https://syd.cloud.appwrite.io/v1/storage/buckets/avatar-images/files/6918c30a0030bf4a8610/view?project=6861b5e20027ba386475&mode=admin',
    'https://syd.cloud.appwrite.io/v1/storage/buckets/avatar-images/files/6918c30f00185484c2ec/view?project=6861b5e20027ba386475&mode=admin',
    'https://syd.cloud.appwrite.io/v1/storage/buckets/avatar-images/files/6918c3150026cd837cfa/view?project=6861b5e20027ba386475&mode=admin',
    'https://syd.cloud.appwrite.io/v1/storage/buckets/avatar-images/files/6918c31a0002e95e4b1c/view?project=6861b5e20027ba386475&mode=admin'
  ];

  if (availableAvatars.includes(avatarPath)) {
    return avatarPath;
  }

  return fallback;
}
