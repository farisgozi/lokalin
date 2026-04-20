"use client";

import { FormEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuthGate from "@/app/components/auth/AuthGate";
import { useAuth } from "@/app/providers/AuthProvider";
import { createSuggestion, uploadUMKMImage } from "@/lib/appwrite/database";
import {
    Store,
    MapPin,
    Phone,
    Clock,
    FileText,
    Tag,
    CheckCircle2,
    ArrowRight,
    Upload,
    Globe,
    Loader2,
    Plus,
    Trash2,
    Image as ImageIcon,
} from "lucide-react";

const categories = ["Makanan", "Minuman", "Jasa"];

export default function UploadUMKMPage() {
    const { user } = useAuth();
    const [name, setName] = useState("");
    const [category, setCategory] = useState("Makanan");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [phone, setPhone] = useState("");
    const [openTime, setOpenTime] = useState("08:00");
    const [closeTime, setCloseTime] = useState("22:00");
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [socialMedia, setSocialMedia] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    function resetForm() {
        setName("");
        setCategory("Makanan");
        setAddress("");
        setDescription("");
        setPhone("");
        setOpenTime("08:00");
        setCloseTime("22:00");
        setUploadedImages([]);
        setSocialMedia("");
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!user) return;
        setSubmitting(true);

        try {
            await createSuggestion({
                name,
                category,
                address,
                description,
                phone: phone ? `+62${phone}` : '',
                images: uploadedImages,
                submitted_by: user.id,
                status: "PENDING",
                submitted_at: new Date().toISOString(),
            });

            resetForm();
            setSubmitted(true);
        } catch (err) {
            console.error("Submit failed:", err);
            alert("Gagal mengirim pengajuan. Silakan coba lagi.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <AuthGate allow={["user"]}>
            <section className="min-h-screen pt-24 pb-12 px-4 md:px-8 bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-50">
                <div className="max-w-3xl mx-auto">
                    <AnimatePresence mode="wait">
                        {submitted ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="bg-white/80 backdrop-blur-xl rounded-3xl border border-green-100 shadow-2xl p-8 md:p-12 text-center"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                    className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg shadow-emerald-500/30 mb-6"
                                >
                                    <CheckCircle2 className="w-10 h-10 text-white" />
                                </motion.div>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                                    Pengajuan Berhasil! 🎉
                                </h2>
                                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                    UMKM Anda telah dikirim untuk direview oleh admin. Anda akan
                                    mendapat notifikasi saat status berubah.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSubmitted(false)}
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold shadow-lg shadow-orange-500/25"
                                    >
                                        <Upload className="w-5 h-5" />
                                        Upload Lagi
                                    </motion.button>
                                    <a
                                        href="/"
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                                    >
                                        Ke Beranda
                                        <ArrowRight className="w-4 h-4" />
                                    </a>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-2xl shadow-orange-500/5 p-6 md:p-8"
                            >
                                {/* Header */}
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
                                        <Store className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                            Upload UMKM
                                        </h1>
                                        <p className="text-sm text-gray-500">
                                            Kirim data UMKM untuk direview admin
                                        </p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Nama UMKM */}
                                    <FormField
                                        icon={<Store className="w-5 h-5" />}
                                        label="Nama UMKM"
                                        required
                                    >
                                        <input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="form-input"
                                            placeholder="Contoh: Warung Mie Ayam Pak Joko"
                                            required
                                        />
                                    </FormField>

                                    {/* Kategori */}
                                    <FormField
                                        icon={<Tag className="w-5 h-5" />}
                                        label="Kategori"
                                        required
                                    >
                                        <div className="flex flex-wrap gap-2">
                                            {categories.map((cat) => (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    onClick={() => setCategory(cat)}
                                                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${category === cat
                                                        ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                        }`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </FormField>

                                    {/* Alamat */}
                                    <FormField
                                        icon={<MapPin className="w-5 h-5" />}
                                        label="Alamat Lengkap"
                                        required
                                    >
                                        <input
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className="form-input"
                                            placeholder="Jl. Contoh No.123, Kecamatan, Kota"
                                            required
                                        />
                                    </FormField>

                                    {/* Deskripsi */}
                                    <FormField
                                        icon={<FileText className="w-5 h-5" />}
                                        label="Deskripsi UMKM"
                                        required
                                    >
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="form-input min-h-28 resize-none"
                                            placeholder="Ceritakan tentang UMKM ini, produk unggulan, keunikan, dll..."
                                            required
                                        />
                                    </FormField>

                                    {/* Divider */}
                                    <div className="flex items-center gap-3 py-2">
                                        <div className="flex-1 h-px bg-gray-200" />
                                        <span className="text-xs text-gray-400 font-medium">
                                            Informasi Tambahan (Opsional)
                                        </span>
                                        <div className="flex-1 h-px bg-gray-200" />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        {/* Telepon */}
                                        <FormField
                                            icon={<Phone className="w-5 h-5" />}
                                            label="No. Telepon"
                                        >
                                            <div className="flex">
                                                <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-100 text-sm text-gray-600 font-medium">+62</span>
                                                <input
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                                    className="form-input !rounded-l-none"
                                                    placeholder="81219769477"
                                                    inputMode="numeric"
                                                />
                                            </div>
                                        </FormField>

                                        {/* Jam Buka */}
                                        <FormField
                                            icon={<Clock className="w-5 h-5" />}
                                            label="Jam Operasional"
                                        >
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="time"
                                                    value={openTime}
                                                    onChange={(e) => setOpenTime(e.target.value)}
                                                    className="form-input flex-1"
                                                />
                                                <span className="text-gray-400 text-sm font-medium">—</span>
                                                <input
                                                    type="time"
                                                    value={closeTime}
                                                    onChange={(e) => setCloseTime(e.target.value)}
                                                    className="form-input flex-1"
                                                />
                                            </div>
                                        </FormField>
                                    </div>

                                    {/* Image Upload */}
                                    <div className="sm:col-span-2">
                                        <FormField
                                            icon={<ImageIcon className="w-5 h-5" />}
                                            label="Foto UMKM"
                                        >
                                            <>
                                                {uploadedImages.length > 0 && (
                                                    <div className="grid grid-cols-3 gap-2 mb-3">
                                                        {uploadedImages.map((url, i) => (
                                                            <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-video">
                                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                <img src={url} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setUploadedImages(uploadedImages.filter((_, idx) => idx !== i))}
                                                                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <label className="relative flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50/50 hover:bg-orange-50/50 hover:border-orange-300 transition-colors">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                        disabled={uploading}
                                                        onChange={async (e) => {
                                                            const files = e.target.files;
                                                            if (!files || files.length === 0) return;
                                                            setUploading(true);
                                                            try {
                                                                const urls: string[] = [];
                                                                for (let i = 0; i < files.length; i++) {
                                                                    const file = files[i];
                                                                    if (!file.type.startsWith("image/")) continue;
                                                                    // Compress before upload
                                                                    const compressed = await new Promise<File>((resolve, reject) => {
                                                                        const img = new window.Image();
                                                                        img.onload = () => {
                                                                            const canvas = document.createElement("canvas");
                                                                            let w = img.width, h = img.height;
                                                                            if (w > 1920) { h = Math.round((h * 1920) / w); w = 1920; }
                                                                            canvas.width = w; canvas.height = h;
                                                                            const ctx = canvas.getContext("2d");
                                                                            if (!ctx) return reject(new Error("no canvas"));
                                                                            ctx.drawImage(img, 0, 0, w, h);
                                                                            canvas.toBlob(b => b ? resolve(new File([b], file.name, { type: "image/jpeg" })) : reject(), "image/jpeg", 0.8);
                                                                        };
                                                                        img.onerror = () => reject();
                                                                        img.src = URL.createObjectURL(file);
                                                                    });
                                                                    const url = await uploadUMKMImage(compressed);
                                                                    urls.push(url);
                                                                }
                                                                setUploadedImages([...uploadedImages, ...urls]);
                                                            } catch (err) {
                                                                console.error("Upload failed:", err);
                                                                alert("Gagal mengupload gambar.");
                                                            } finally {
                                                                setUploading(false);
                                                                e.target.value = "";
                                                            }
                                                        }}
                                                    />
                                                    {uploading ? (
                                                        <>
                                                            <Loader2 className="w-7 h-7 text-orange-400 animate-spin mb-1" />
                                                            <p className="text-sm text-orange-600 font-medium">Mengupload...</p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Plus className="w-7 h-7 text-gray-400 mb-1" />
                                                            <p className="text-xs text-gray-500 font-medium">Klik atau drag foto ke sini</p>
                                                            <p className="text-[10px] text-gray-400">PNG, JPG, WebP</p>
                                                        </>
                                                    )}
                                                </label>
                                            </>
                                        </FormField>
                                    </div>

                                    {/* Social Media */}
                                    <FormField
                                        icon={<Globe className="w-5 h-5" />}
                                        label="Link Social Media"
                                    >
                                        <input
                                            value={socialMedia}
                                            onChange={(e) => setSocialMedia(e.target.value)}
                                            className="form-input"
                                            placeholder="https://instagram.com/umkm-anda"
                                        />
                                    </FormField>

                                    {/* Submit */}
                                    <motion.button
                                        type="submit"
                                        disabled={submitting}
                                        whileHover={{ scale: submitting ? 1 : 1.01 }}
                                        whileTap={{ scale: submitting ? 1 : 0.98 }}
                                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 text-white py-3.5 font-semibold shadow-lg shadow-orange-500/25 transition-all mt-4 disabled:opacity-60"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Mengirim...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-5 h-5" />
                                                Kirim Pengajuan
                                            </>
                                        )}
                                    </motion.button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Inline style for form inputs */}
                <style jsx global>{`
          .form-input {
            width: 100%;
            border-radius: 0.75rem;
            border: 1px solid #e5e7eb;
            padding: 0.75rem 1rem;
            background: rgba(249, 250, 251, 0.5);
            outline: none;
            transition: all 0.2s;
            font-size: 0.875rem;
            color: #111827;
          }
          .form-input::placeholder {
            color: #9ca3af;
          }
          .form-input:focus {
            border-color: #fb923c;
            box-shadow: 0 0 0 4px rgba(251, 146, 60, 0.1);
          }
        `}</style>
            </section>
        </AuthGate>
    );
}

function FormField({
    icon,
    label,
    required,
    children,
}: {
    icon: React.ReactNode;
    label: string;
    required?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <span className="text-gray-400">{icon}</span>
                {label}
                {required && <span className="text-orange-500">*</span>}
            </label>
            {children}
        </div>
    );
}
