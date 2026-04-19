"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuthGate from "@/app/components/auth/AuthGate";
import DashboardLayout from "@/app/components/layouts/DashboardLayout";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Inbox,
  Search,
  MapPin,
  Tag,
  CalendarDays,
  Filter,
  User,
  Store,
  MessageSquare,
  Loader2,
  ExternalLink,
  Navigation,
} from "lucide-react";
import {
  getAllUMKMs,
  getAllSuggestions,
  updateUMKMStatus,
  updateSuggestionStatus,
  type UMKMDocument,
  type SuggestionDocument,
} from "@/lib/appwrite/database";

type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";
type SourceType = "owner" | "user";

interface MergedSubmission {
  id: string;
  name: string;
  category: string;
  address: string;
  description: string;
  createdAt: string;
  status: SubmissionStatus;
  rejectReason?: string;
  source: SourceType;
  ownerName?: string;
  ownerEmail?: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

type TabFilter = "all" | SubmissionStatus;

export default function AdminDashboardPage() {
  const [items, setItems] = useState<MergedSubmission[]>([]);
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [dataLoading, setDataLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  // Lat/long input per submission
  const [coordInputs, setCoordInputs] = useState<Record<string, { lat: string; lng: string }>>({});

  function getCoords(id: string) {
    return coordInputs[id] || { lat: "", lng: "" };
  }

  function setCoords(id: string, field: "lat" | "lng", value: string) {
    setCoordInputs((prev) => ({
      ...prev,
      [id]: { ...getCoords(id), [field]: value },
    }));
  }

  function openGoogleMaps(address: string) {
    const url = `https://www.google.com/maps/search/${encodeURIComponent(address)}`;
    window.open(url, "_blank");
  }

  const loadItems = useCallback(async () => {
    setDataLoading(true);
    try {
      const [umkms, suggestions] = await Promise.all([
        getAllUMKMs(),
        getAllSuggestions(),
      ]);

      const ownerItems: MergedSubmission[] = umkms.map((u: UMKMDocument) => ({
        id: u.$id!,
        name: u.name,
        category: u.category,
        address: u.address,
        description: u.description,
        createdAt: u.submitted_at,
        status: u.status,
        rejectReason: u.rejection_reason,
        source: "owner" as SourceType,
        ownerName: u.owner_name,
        ownerEmail: u.owner_email,
        phone: u.phone,
        latitude: u.latitude,
        longitude: u.longitude,
      }));

      const userItems: MergedSubmission[] = suggestions.map((s: SuggestionDocument) => ({
        id: s.$id!,
        name: s.name,
        category: s.category,
        address: s.address,
        description: s.description,
        createdAt: s.submitted_at,
        status: s.status,
        rejectReason: s.rejection_reason,
        source: "user" as SourceType,
        phone: s.phone,
        latitude: s.latitude,
        longitude: s.longitude,
      }));

      const all = [...ownerItems, ...userItems].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setItems(all);
    } catch (err) {
      console.error("Failed to load submissions:", err);
      setItems([]);
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  async function handleApprove(id: string, source: SourceType) {
    const coords = getCoords(id);
    const lat = parseFloat(coords.lat);
    const lng = parseFloat(coords.lng);

    if (!coords.lat || !coords.lng || isNaN(lat) || isNaN(lng)) {
      alert("Masukkan koordinat Latitude & Longitude terlebih dahulu!\n\nKlik \"Buka Google Maps\" → cari lokasi → copy koordinat dari URL.");
      return;
    }

    setApprovingId(id);
    try {
      const coordinates = { latitude: lat, longitude: lng };
      if (source === "owner") {
        await updateUMKMStatus(id, "APPROVED", undefined, coordinates);
      } else {
        await updateSuggestionStatus(id, "APPROVED", undefined, coordinates);
      }
      await loadItems();
    } catch (err) {
      console.error("Approve failed:", err);
      alert("Gagal approve. Coba lagi.");
    } finally {
      setApprovingId(null);
    }
  }

  async function handleReject(id: string, source: SourceType, reason: string) {
    try {
      if (source === "owner") {
        await updateUMKMStatus(id, "REJECTED", reason);
      } else {
        await updateSuggestionStatus(id, "REJECTED", reason);
      }
      await loadItems();
    } catch (err) {
      console.error("Reject failed:", err);
      alert("Gagal reject. Coba lagi.");
    }
    setRejectId(null);
    setRejectReason("");
  }

  const counts = useMemo(() => {
    const pending = items.filter((x) => x.status === "PENDING").length;
    const approved = items.filter((x) => x.status === "APPROVED").length;
    const rejected = items.filter((x) => x.status === "REJECTED").length;
    return { total: items.length, pending, approved, rejected };
  }, [items]);

  const filteredItems = useMemo(() => {
    let result = items;
    if (activeTab !== "all") {
      result = result.filter((x) => x.status === activeTab);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (x) =>
          x.name.toLowerCase().includes(q) ||
          x.category.toLowerCase().includes(q) ||
          x.address.toLowerCase().includes(q)
      );
    }
    return result;
  }, [items, activeTab, searchQuery]);

  const tabs: { key: TabFilter; label: string; count: number }[] = [
    { key: "all", label: "Semua", count: counts.total },
    { key: "PENDING", label: "Pending", count: counts.pending },
    { key: "APPROVED", label: "Approved", count: counts.approved },
    { key: "REJECTED", label: "Rejected", count: counts.rejected },
  ];

  return (
    <AuthGate allow={["admin"]}>
      <DashboardLayout
        title="Dashboard Admin"
        subtitle="Kelola pengajuan UMKM dari pengguna & pemilik usaha"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 max-w-6xl"
        >
          {/* Stats Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard icon={<Inbox className="w-5 h-5" />} label="Total Pengajuan" value={counts.total} iconBg="from-blue-400 to-indigo-500" />
            <StatsCard icon={<Clock className="w-5 h-5" />} label="Pending" value={counts.pending} iconBg="from-amber-400 to-orange-500" valueColor="text-amber-600" />
            <StatsCard icon={<CheckCircle2 className="w-5 h-5" />} label="Approved" value={counts.approved} iconBg="from-emerald-400 to-green-500" valueColor="text-emerald-600" />
            <StatsCard icon={<XCircle className="w-5 h-5" />} label="Rejected" value={counts.rejected} iconBg="from-red-400 to-rose-500" valueColor="text-red-600" />
          </motion.div>

          {/* Filter + Search */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                    <Filter className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Daftar Pengajuan UMKM</h2>
                </div>
                <div className="relative max-w-xs w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari pengajuan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === tab.key
                        ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    {tab.label}
                    <span className={`px-1.5 py-0.5 rounded-full text-xs ${activeTab === tab.key ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"}`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Loading */}
            {dataLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="w-8 h-8 text-orange-400 animate-spin mb-4" />
                <p className="text-sm text-gray-500">Memuat data...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                  <Inbox className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-sm font-semibold text-gray-500">
                  {searchQuery ? "Tidak ada hasil pencarian" : "Belum ada pengajuan UMKM"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filteredItems.map((item, index) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-5 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="font-bold text-gray-900 text-base">{item.name}</h3>
                          <StatusBadge status={item.status} />
                          <SourceBadge source={item.source} />
                        </div>

                        {item.source === "owner" && item.ownerName && (
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {item.ownerName} ({item.ownerEmail})
                            </span>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-2">
                          <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" />{item.category}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /><span className="truncate max-w-[200px]">{item.address}</span></span>
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-3.5 h-3.5" />
                            {new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>

                        {item.status === "APPROVED" && item.latitude && item.longitude && (
                          <div className="mt-2 flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg w-fit">
                            <Navigation className="w-3.5 h-3.5" />
                            {item.latitude.toFixed(6)}, {item.longitude.toFixed(6)}
                          </div>
                        )}

                        {item.status === "REJECTED" && item.rejectReason && (
                          <div className="mt-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                            <p className="text-xs text-red-600"><strong>Alasan penolakan:</strong> {item.rejectReason}</p>
                          </div>
                        )}
                      </div>

                      {/* Actions for pending items */}
                      {item.status === "PENDING" && (
                        <div className="flex flex-col gap-3 flex-shrink-0 min-w-[260px]">
                          {/* Google Maps link */}
                          <button
                            onClick={() => openGoogleMaps(item.address)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium hover:bg-blue-100 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Buka Google Maps
                          </button>

                          {/* Lat/Long inputs */}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Latitude</label>
                              <input
                                type="text"
                                placeholder="-6.123456"
                                value={getCoords(item.id).lat}
                                onChange={(e) => setCoords(item.id, "lat", e.target.value)}
                                className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Longitude</label>
                              <input
                                type="text"
                                placeholder="106.123456"
                                value={getCoords(item.id).lng}
                                onChange={(e) => setCoords(item.id, "lng", e.target.value)}
                                className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10"
                              />
                            </div>
                          </div>

                          {/* Approve / Reject buttons */}
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileTap={{ scale: 0.97 }}
                              onClick={() => handleApprove(item.id, item.source)}
                              disabled={approvingId === item.id}
                              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold shadow-md shadow-emerald-500/20 hover:bg-emerald-600 transition-colors disabled:opacity-60"
                            >
                              {approvingId === item.id ? (
                                <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
                              ) : (
                                <><CheckCircle2 className="w-4 h-4" />Approve</>
                              )}
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setRejectId(item.id)}
                              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-red-500 border border-red-200 text-sm font-semibold hover:bg-red-50 transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </motion.button>
                          </div>
                        </div>
                      )}
                    </div>

                    <AnimatePresence>
                      {rejectId === item.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 bg-red-50 border border-red-100 rounded-xl p-4 overflow-hidden"
                        >
                          <label className="flex items-center gap-2 text-sm font-semibold text-red-700 mb-2">
                            <MessageSquare className="w-4 h-4" />
                            Alasan Penolakan
                          </label>
                          <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Jelaskan alasan penolakan (opsional)..."
                            className="w-full rounded-lg border border-red-200 px-3 py-2.5 text-sm bg-white outline-none focus:border-red-400 focus:ring-2 focus:ring-red-500/10 resize-none"
                            rows={2}
                          />
                          <div className="flex items-center gap-2 mt-3">
                            <motion.button
                              whileTap={{ scale: 0.97 }}
                              onClick={() => handleReject(item.id, item.source, rejectReason)}
                              className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition-colors"
                            >
                              Konfirmasi Reject
                            </motion.button>
                            <button
                              onClick={() => { setRejectId(null); setRejectReason(""); }}
                              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                            >
                              Batal
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.article>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </DashboardLayout>
    </AuthGate>
  );
}

function StatsCard({ icon, label, value, iconBg, valueColor }: { icon: React.ReactNode; label: string; value: number; iconBg: string; valueColor?: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${iconBg} flex items-center justify-center text-white shadow-md`}>
          {icon}
        </div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
      </div>
      <p className={`text-2xl font-bold ${valueColor || "text-gray-900"}`}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: SubmissionStatus }) {
  const config = {
    PENDING: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500", label: "Pending" },
    APPROVED: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500", label: "Approved" },
    REJECTED: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500", label: "Rejected" },
  };
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function SourceBadge({ source }: { source: SourceType }) {
  const isOwner = source === "owner";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${isOwner ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
      {isOwner ? <Store className="w-3 h-3" /> : <User className="w-3 h-3" />}
      {isOwner ? "Owner" : "User"}
    </span>
  );
}
