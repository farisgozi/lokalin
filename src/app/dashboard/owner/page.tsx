"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AuthGate from "@/app/components/auth/AuthGate";
import DashboardLayout from "@/app/components/layouts/DashboardLayout";
import AIAnalyticsResponse from "@/app/components/ui/AIAnalyticsResponse";
import { useAuth } from "@/app/providers/AuthProvider";
import {
  Star,
  Sparkles,
  BarChart3,
  RefreshCw,
  CheckCircle2,
  MapPin,
  Phone,
  Clock,
  Tag,
  Info,
  Save,
  FileEdit,
  Image as ImageIcon,
  Plus,
  Trash2,
  Globe,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { getUMKMByOwnerId, updateUMKMDetails, uploadUMKMImage, deleteUMKMImage, type UMKMDocument } from "@/lib/appwrite/database";
import { getRatings, getAverageRating, type UserRating } from "@/app/data/umkmDummy";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function OwnerDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [submission, setSubmission] = useState<UMKMDocument | null>(null);
  const [submissionLoading, setSubmissionLoading] = useState(true);

  // Edit form state
  const [isEditing, setIsEditing] = useState(false);
  const [editDesc, setEditDesc] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editHours, setEditHours] = useState("");
  const [editSocial, setEditSocial] = useState("");
  const [editImages, setEditImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [ratings, setRatings] = useState<UserRating[]>([]);
  const [avgRating, setAvgRating] = useState<{ average: number; count: number }>({ average: 0, count: 0 });

  // Load owner's UMKM data
  useEffect(() => {
    if (!user) return;

    async function loadData() {
      try {
        const doc = await getUMKMByOwnerId(user!.id);

        if (!doc) {
          router.replace("/onboarding");
          return;
        }

        // Normalize status to uppercase for consistent comparison
        const normalizedDoc = { ...doc, status: (doc.status || "PENDING").toUpperCase() as "PENDING" | "APPROVED" | "REJECTED" };

        if (normalizedDoc.status === "PENDING" || normalizedDoc.status === "REJECTED") {
          router.replace("/");
          return;
        }

        setSubmission(normalizedDoc);
        // Initialize edit fields
        setEditDesc(doc.description || "");
        setEditPhone(doc.phone || "");
        setEditHours(doc.open_hours || "");
        setEditSocial(doc.social_media || "");
        setEditImages(doc.images || []);

        // Load ratings for this UMKM
        if (normalizedDoc.$id) {
          setRatings(getRatings(normalizedDoc.$id));
          setAvgRating(getAverageRating(normalizedDoc.$id));
        }
      } catch {
        setSubmission(null);
      } finally {
        setSubmissionLoading(false);
      }
    }

    loadData();
  }, [user, router]);

  const businessName = submission?.name || "UMKM Saya";

  function startEditing() {
    setIsEditing(true);
    setSaveSuccess(false);
  }

  function cancelEditing() {
    if (!submission) return;
    setEditDesc(submission.description || "");
    setEditPhone(submission.phone || "");
    setEditHours(submission.open_hours || "");
    setEditSocial(submission.social_media || "");
    setEditImages(submission.images || []);
    setIsEditing(false);
  }

  async function handleSave() {
    if (!submission?.$id) return;
    setSaving(true);
    try {
      await updateUMKMDetails(submission.$id, {
        description: editDesc,
        phone: editPhone,
        open_hours: editHours,
        social_media: editSocial,
        images: editImages,
      });

      // Refresh data
      const updated = await getUMKMByOwnerId(user!.id);
      if (updated) {
        setSubmission(updated);
        setEditImages(updated.images || editImages);
      }

      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Save failed:", err);
      alert("Gagal menyimpan perubahan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  async function compressImage(file: File, maxWidth = 1920, quality = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Compression failed"));
            const compressed = new File([blob], file.name, { type: "image/jpeg" });
            resolve(compressed);
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  }

  async function handleFileUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith("image/")) continue;
        // Compress to keep under size limit
        const compressed = await compressImage(file);
        if (compressed.size > 5 * 1024 * 1024) {
          alert(`Gambar "${file.name}" terlalu besar (${(compressed.size / 1024 / 1024).toFixed(1)}MB). Maks 5MB setelah kompresi.`);
          continue;
        }
        const url = await uploadUMKMImage(compressed);
        urls.push(url);
      }
      if (urls.length > 0) {
        setEditImages([...editImages, ...urls]);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Gagal mengupload gambar. Pastikan koneksi internet stabil.");
    } finally {
      setUploading(false);
    }
  }

  async function removeImage(index: number) {
    const url = editImages[index];
    setEditImages(editImages.filter((_, i) => i !== index));
    // Try to delete from storage (non-blocking)
    if (url.includes("/storage/buckets/")) {
      deleteUMKMImage(url).catch(() => { });
    }
  }

  async function runAiAnalysis() {
    setLoading(true);
    try {
      // Build trend from actual ratings
      const ratingValues = ratings.length > 0
        ? ratings.map(r => r.rating)
        : [avgRating.average || 0];
      const ratingLabels = ratings.length > 0
        ? ratings.map(r => new Date(r.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" }))
        : ["Saat ini"];

      const res = await fetch("/api/ai/rating-trend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          trend: ratingValues,
          labels: ratingLabels,
          averageRating: avgRating.average,
          totalReviews: avgRating.count,
          recentReviews: ratings.slice(0, 5).map(r => ({
            rating: r.rating,
            comment: r.comment || "",
            date: r.createdAt,
          })),
        }),
      });

      const data = (await res.json()) as { analysis?: string; error?: string };
      if (!res.ok || !data.analysis) {
        throw new Error(data.error || "Gagal mengambil analisis AI");
      }
      setAnalysis(data.analysis);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setAnalysis(`Analisis tidak tersedia: ${message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthGate allow={["owner"]}>
      <DashboardLayout
        title={submissionLoading ? "Dashboard" : `Dashboard — ${businessName}`}
        subtitle="Kelola data usaha dan dapatkan insight dari AI"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 max-w-6xl"
        >
          {/* Approved Banner */}
          {!submissionLoading && submission?.status === "APPROVED" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <p className="text-sm font-medium text-emerald-800">
                  UMKM &ldquo;{submission.name}&rdquo; sudah live di Homepage!
                </p>
              </div>
              {submission.$id && (
                <a
                  href={`/umkm/${submission.$id}`}
                  target="_blank"
                  className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 whitespace-nowrap"
                >
                  Lihat Halaman <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </motion.div>
          )}

          {/* Save Success */}
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <p className="text-sm font-medium text-emerald-700">Perubahan berhasil disimpan!</p>
            </motion.div>
          )}

          {/* Business Info + Edit Card */}
          {!submissionLoading && submission && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Star className="w-5 h-5 text-orange-500" />
                  Informasi Usaha
                </h2>

                {!isEditing ? (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={startEditing}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 text-orange-700 text-sm font-semibold rounded-xl hover:bg-orange-100 transition-colors"
                  >
                    <FileEdit className="w-4 h-4" /> Edit Detail
                  </motion.button>
                ) : (
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-xl shadow-md hover:bg-emerald-600 transition-colors disabled:opacity-60"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {saving ? "Menyimpan..." : "Simpan"}
                    </motion.button>
                    <button
                      onClick={cancelEditing}
                      className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Batal
                    </button>
                  </div>
                )}
              </div>

              {!isEditing ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoRow icon={<Tag className="w-4 h-4" />} label="Kategori" value={submission.category} />
                    <InfoRow icon={<MapPin className="w-4 h-4" />} label="Alamat" value={submission.address} />
                    <InfoRow icon={<Phone className="w-4 h-4" />} label="Telepon" value={submission.phone || "-"} />
                    <InfoRow icon={<Clock className="w-4 h-4" />} label="Jam Operasional" value={submission.open_hours || "-"} />
                    <InfoRow icon={<Globe className="w-4 h-4" />} label="Social Media / WhatsApp" value={submission.social_media || "-"} />
                  </div>
                  {submission.description && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600">{submission.description}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  {/* Description */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Deskripsi Usaha</label>
                    <textarea
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50/50 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 text-sm min-h-24 resize-none"
                      placeholder="Ceritakan tentang usaha Anda..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">No. Telepon / WhatsApp</label>
                      <input
                        type="text"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50/50 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 text-sm"
                        placeholder="+62 812-xxxx-xxxx"
                      />
                    </div>
                    {/* Open Hours */}
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">Jam Operasional</label>
                      <input
                        type="text"
                        value={editHours}
                        onChange={(e) => setEditHours(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50/50 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 text-sm"
                        placeholder="08:00 - 22:00"
                      />
                    </div>
                  </div>

                  {/* Social Media */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Link Social Media</label>
                    <input
                      type="text"
                      value={editSocial}
                      onChange={(e) => setEditSocial(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50/50 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 text-sm"
                      placeholder="https://instagram.com/umkm-anda atau nomor WhatsApp"
                    />
                  </div>

                  {/* Gallery / Images */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-gray-400" />
                      Gallery Foto
                    </label>

                    {editImages.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                        {editImages.map((url, i) => (
                          <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-video">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeImage(i)}
                              className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload area */}
                    <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50/50 hover:bg-orange-50/50 hover:border-orange-300 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => handleFileUpload(e.target.files)}
                        disabled={uploading}
                      />
                      {uploading ? (
                        <>
                          <Loader2 className="w-8 h-8 text-orange-400 animate-spin mb-2" />
                          <p className="text-sm text-orange-600 font-medium">Mengupload...</p>
                        </>
                      ) : (
                        <>
                          <Plus className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500 font-medium">Klik atau drag foto ke sini</p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP (maks 10MB)</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              )}

              {!isEditing && submission.latitude && submission.longitude && (
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                  <MapPin className="w-3 h-3" />
                  Koordinat: {submission.latitude.toFixed(5)}, {submission.longitude.toFixed(5)}
                </div>
              )}
            </motion.div>
          )}

          {/* Rating & Reviews */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Statistik Rating</h3>
                <p className="text-xs text-gray-500">Data rating dari pelanggan</p>
              </div>
            </div>

            {ratings.length === 0 ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Belum ada ulasan</p>
                  <p className="text-xs text-amber-600 mt-1">
                    Statistik rating akan tampil di sini setelah pelanggan memberikan ulasan pada halaman usaha Anda.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Summary */}
                <div className="flex items-center gap-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-orange-600">{avgRating.average.toFixed(1)}</p>
                    <div className="flex items-center gap-0.5 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.round(avgRating.average) ? "fill-orange-400 text-orange-400" : "fill-gray-200 text-gray-200"}`} />
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="font-semibold">{avgRating.count} ulasan</p>
                    <p className="text-xs text-gray-400">dari pelanggan</p>
                  </div>
                </div>

                {/* Recent reviews */}
                <div className="divide-y divide-gray-50">
                  {ratings.slice(0, 5).map((review) => (
                    <div key={review.id} className="py-3 flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {review.userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-gray-900">{review.userName}</p>
                          <span className="text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5 my-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} />
                          ))}
                        </div>
                        {review.comment && <p className="text-xs text-gray-600 line-clamp-2">{review.comment}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* AI Analysis */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white shadow-md">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Analisis AI</h3>
                  <p className="text-xs text-gray-500">Powered by Gemini</p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={runAiAnalysis}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" />Menganalisis...</>
                ) : (
                  <><Sparkles className="w-4 h-4" />Minta Analisis</>
                )}
              </motion.button>
            </div>

            {analysis ? (
              <AIAnalyticsResponse text={analysis} />
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Klik &ldquo;Minta Analisis&rdquo; untuk mendapatkan insight AI tentang usaha Anda</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </DashboardLayout>
    </AuthGate>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
      <span className="text-gray-400 mt-0.5">{icon}</span>
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-sm text-gray-900 font-semibold">{value}</p>
      </div>
    </div>
  );
}
