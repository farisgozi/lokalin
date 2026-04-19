"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getUMKMForPopup, UMKM, getRatings, addRating, UserRating } from "@/app/data/umkmDummy";
import { getUMKMById } from "@/lib/appwrite/database";
import LoadingSpinner from "@/app/components/layouts/LoadingSpinner";
import UMKMNotFound from "@/app/components/layouts/UMKMNotFound";
import RatingStars from "@/app/components/ui/RatingStars";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, MessageSquare, User } from "lucide-react";

// Import modular components
import HeroSection from "@/app/components/umkm-detail/HeroSection";
import ActionBar from "@/app/components/umkm-detail/ActionBar";
import AboutTab from "@/app/components/umkm-detail/AboutTab";
import GalleryTab from "@/app/components/umkm-detail/GalleryTab";
import InfoTab from "@/app/components/umkm-detail/InfoTab";
import Sidebar from "@/app/components/umkm-detail/Sidebar";
import RelatedSection from "@/app/components/umkm-detail/RelatedSection";

gsap.registerPlugin(ScrollTrigger);

const defaultImage = 'https://syd.cloud.appwrite.io/v1/storage/buckets/umkm-images/files/umkm-placeholder/view?project=6861b5e20027ba386475&mode=admin';

export default function UMKMDetailPage() {
  const params = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const [umkm, setUmkm] = useState<UMKM | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("about");

  // Rating state
  const [ratings, setRatings] = useState<UserRating[]>([]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const umkmId = params.id as string;

  const loadRatings = useCallback(() => {
    if (umkmId) {
      setRatings(getRatings(umkmId));
    }
  }, [umkmId]);

  useEffect(() => {
    if (!params.id) return;
    const id = params.id as string;

    // Try static lookup first
    const umkmData = getUMKMForPopup(id);
    if (umkmData) {
      const normalized = {
        ...umkmData,
        gallery: Array.isArray(umkmData.gallery) ? umkmData.gallery : [umkmData.gallery],
      };
      setUmkm(normalized);
      setIsLoading(false);
      return;
    }

    // Fallback: load from Appwrite
    getUMKMById(id).then((doc) => {
      if (doc && doc.status === "APPROVED") {
        const converted: UMKM = {
          id: doc.$id!,
          name: doc.name,
          address: doc.address,
          lat: doc.latitude || 0,
          lng: doc.longitude || 0,
          category: doc.category,
          description: doc.description,
          phone: doc.phone,
          gallery: doc.images && doc.images.length > 0 ? doc.images : [defaultImage],
          rating: 0,
          openHours: doc.open_hours
            ? { open: doc.open_hours.split('-')[0]?.trim() || '', close: doc.open_hours.split('-')[1]?.trim() || '', days: ['Setiap Hari'] }
            : undefined,
          socialMedia: doc.social_media
            ? { whatsapp: doc.social_media }
            : undefined,
        };
        setUmkm(converted);
      } else {
        setUmkm(null);
      }
      setIsLoading(false);
    }).catch(() => {
      setUmkm(null);
      setIsLoading(false);
    });
  }, [params.id]);

  useEffect(() => {
    loadRatings();
  }, [loadRatings]);

  function handleSubmitRating() {
    if (newRating === 0) return;
    addRating(umkmId, newRating, newComment, reviewerName || "Anonim");
    loadRatings();
    setNewRating(0);
    setNewComment("");
    setReviewerName("");
    setRatingSubmitted(true);
    setTimeout(() => setRatingSubmitted(false), 3000);
  }

  const avgRating =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : umkm?.rating || 0;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!umkm) {
    return <UMKMNotFound />;
  }

  return (
    <section ref={containerRef} className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <HeroSection
        umkm={umkm}
        isLiked={isLiked}
        onLikeToggle={() => setIsLiked(!isLiked)}
        heroImageRef={heroImageRef}
      />

      {/* Content Section */}
      <section className="relative -mt-20 pb-20 px-6 z-10">
        <div className="max-w-6xl mx-auto">
          {/* Action Bar */}
          <ActionBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            umkm={umkm}
          />

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-8">
              {activeTab === "about" && <AboutTab umkm={umkm} />}
              {activeTab === "gallery" && <GalleryTab umkm={umkm} />}
              {activeTab === "info" && <InfoTab umkm={umkm} />}

              {/* Rating & Review Section */}
              <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Rating & Ulasan</h3>
                      <div className="flex items-center gap-2">
                        <RatingStars value={avgRating} readOnly size="sm" showValue />
                        <span className="text-sm text-gray-500">
                          ({ratings.length} ulasan)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Rating */}
                <div className="p-6 bg-gradient-to-br from-orange-50/50 to-white border-b border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Berikan Penilaian Anda
                  </h4>

                  <AnimatePresence mode="wait">
                    {ratingSubmitted ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium"
                      >
                        ✅ Terima kasih! Ulasan Anda berhasil ditambahkan.
                      </motion.div>
                    ) : (
                      <motion.div
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500">Rating:</span>
                          <RatingStars value={newRating} onChange={setNewRating} size="md" />
                          {newRating > 0 && (
                            <span className="text-sm font-semibold text-orange-600">
                              {newRating}/5
                            </span>
                          )}
                        </div>

                        <input
                          type="text"
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                          placeholder="Nama Anda (opsional)"
                          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm bg-white outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10"
                        />

                        <div className="flex items-end gap-2">
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Tulis ulasan Anda..."
                            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm bg-white outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 min-h-[44px] resize-none"
                            rows={2}
                          />
                          <motion.button
                            whileHover={{ scale: newRating > 0 ? 1.05 : 1 }}
                            whileTap={{ scale: newRating > 0 ? 0.95 : 1 }}
                            onClick={handleSubmitRating}
                            disabled={newRating === 0}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 text-white text-sm font-semibold shadow-md shadow-orange-500/20 disabled:opacity-40 disabled:shadow-none transition-all"
                          >
                            <Send className="w-4 h-4" />
                            Kirim
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Reviews List */}
                <div className="divide-y divide-gray-50">
                  {ratings.length === 0 ? (
                    <div className="py-12 text-center">
                      <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                      <p className="text-sm text-gray-400">
                        Belum ada ulasan. Jadilah yang pertama!
                      </p>
                    </div>
                  ) : (
                    ratings.slice(0, 10).map((review) => (
                      <div key={review.id} className="p-5 flex gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {review.userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="text-sm font-semibold text-gray-900">
                              {review.userName}
                            </p>
                            <span className="text-xs text-gray-400">
                              {new Date(review.createdAt).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-gray-200 text-gray-200"
                                  }`}
                              />
                            ))}
                          </div>
                          {review.comment && (
                            <p className="text-sm text-gray-600">{review.comment}</p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <Sidebar umkm={umkm} />
          </div>
        </div>
      </section>

      {/* Related UMKM Section */}
      <RelatedSection currentUmkmId={umkm.id} />
    </section>
  );
}