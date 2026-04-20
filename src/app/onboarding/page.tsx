"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/app/providers/AuthProvider";
import {
    Store,
    MapPin,
    Phone,
    Clock,
    FileText,
    Tag,
    CheckCircle2,
    ArrowRight,
    Globe,
} from "lucide-react";
import { createUMKM } from "@/lib/appwrite/database";

type SubmissionStatus = "pending" | "approved" | "rejected";

interface OwnerSubmission {
    id: string;
    ownerId: string;
    ownerName: string;
    ownerEmail: string;
    name: string;
    category: string;
    address: string;
    description: string;
    phone: string;
    openHours: string;
    socialMedia: string;
    createdAt: string;
    status: SubmissionStatus;
    rejectReason?: string;
}

const OWNER_SUBMISSIONS_KEY = "umkm-owner-submissions";

const categories = [
    "Makanan",
    "Minuman",
    "Jasa",
];

export default function OnboardingPage() {
    const router = useRouter();
    const { user } = useAuth();

    const [name, setName] = useState("");
    const [category, setCategory] = useState("Makanan");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [phone, setPhone] = useState("");
    const [openTime, setOpenTime] = useState("08:00");
    const [closeTime, setCloseTime] = useState("22:00");
    const [socialMedia, setSocialMedia] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!user || isSubmitting) return;

        setIsSubmitting(true);
        try {
            // Write to Appwrite (or localStorage fallback) via database.ts
            await createUMKM({
                name,
                category,
                address,
                description,
                phone: phone ? `+62${phone}` : '',
                images: [],
                status: "PENDING",
                owner_id: user.id,
                owner_name: user.name,
                owner_email: user.email,
                submitted_at: new Date().toISOString(),
                open_hours: `${openTime} - ${closeTime}`,
                social_media: socialMedia,
            });

            setSubmitted(true);
        } catch (err) {
            console.error("Submit failed:", err);
            alert("Gagal mengirim data. Silakan coba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (submitted) {
        return (
            <section className="min-h-screen flex items-center justify-center px-4 pt-24 pb-12 bg-gradient-to-br from-orange-50 via-white to-pink-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl border border-green-100 shadow-2xl p-8 text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg shadow-emerald-500/30 mb-6"
                    >
                        <CheckCircle2 className="w-10 h-10 text-white" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        Data Terkirim! 🎉
                    </h2>
                    <p className="text-gray-500 mb-2">
                        Data UMKM Anda telah dikirim untuk direview admin.
                    </p>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                        <p className="text-sm text-amber-700 font-medium">
                            ⏳ Status: <strong>Menunggu Approval</strong>
                        </p>
                        <p className="text-xs text-amber-600 mt-1">
                            Dashboard Anda akan aktif setelah admin menyetujui data usaha.
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push("/dashboard/owner")}
                        className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold shadow-lg shadow-orange-500/25"
                    >
                        Ke Dashboard
                        <ArrowRight className="w-5 h-5" />
                    </motion.button>
                </motion.div>
            </section>
        );
    }

    return (
        <section className="min-h-screen flex items-center justify-center px-4 pt-24 pb-12 bg-gradient-to-br from-orange-50 via-white to-pink-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-200/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-2xl"
            >
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl shadow-orange-500/5 p-6 md:p-8">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
                            <Store className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                Lengkapi Data UMKM
                            </h1>
                            <p className="text-sm text-gray-500">
                                Selamat datang, {user?.name}! Isi data usaha Anda untuk memulai.
                            </p>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-6 mt-4">
                        <p className="text-xs text-blue-700">
                            Data ini akan direview oleh admin sebelum dashboard Anda aktif.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Nama UMKM */}
                        <FormField icon={<Store className="w-5 h-5" />} label="Nama UMKM" required>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50/50 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 text-sm"
                                placeholder="Contoh: Warung Mie Ayam Pak Joko"
                                required
                            />
                        </FormField>

                        {/* Kategori */}
                        <FormField icon={<Tag className="w-5 h-5" />} label="Kategori" required>
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
                        <FormField icon={<MapPin className="w-5 h-5" />} label="Alamat Lengkap" required>
                            <input
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50/50 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 text-sm"
                                placeholder="Jl. Contoh No.123, Kecamatan, Kota"
                                required
                            />
                        </FormField>

                        {/* Deskripsi */}
                        <FormField icon={<FileText className="w-5 h-5" />} label="Deskripsi Usaha" required>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50/50 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 text-sm min-h-24 resize-none"
                                placeholder="Ceritakan tentang usaha Anda..."
                                required
                            />
                        </FormField>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <FormField icon={<Phone className="w-5 h-5" />} label="No. Telepon">
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-100 text-sm text-gray-600 font-medium">+62</span>
                                    <input
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                        className="w-full rounded-r-xl border border-gray-200 px-4 py-3 bg-gray-50/50 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 text-sm"
                                        placeholder="81219769477"
                                        inputMode="numeric"
                                    />
                                </div>
                            </FormField>

                            <FormField icon={<Clock className="w-5 h-5" />} label="Jam Operasional">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="time"
                                        value={openTime}
                                        onChange={(e) => setOpenTime(e.target.value)}
                                        className="flex-1 rounded-xl border border-gray-200 px-3 py-3 bg-gray-50/50 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 text-sm"
                                    />
                                    <span className="text-gray-400 text-sm font-medium">—</span>
                                    <input
                                        type="time"
                                        value={closeTime}
                                        onChange={(e) => setCloseTime(e.target.value)}
                                        className="flex-1 rounded-xl border border-gray-200 px-3 py-3 bg-gray-50/50 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 text-sm"
                                    />
                                </div>
                            </FormField>
                        </div>

                        <FormField icon={<Globe className="w-5 h-5" />} label="Link Social Media">
                            <input
                                value={socialMedia}
                                onChange={(e) => setSocialMedia(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50/50 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 text-sm"
                                placeholder="https://instagram.com/umkm-anda"
                            />
                        </FormField>

                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 text-white py-3.5 font-semibold shadow-lg shadow-orange-500/25 mt-2"
                        >
                            Kirim untuk Review
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </section>
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
