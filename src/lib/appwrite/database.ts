/**
 * Centralized database service — Appwrite primary, localStorage fallback.
 * ALL data reads/writes MUST go through this service.
 */

"use client";

import { databases, storage } from "@/lib/appwrite/client";
import { ID, Query, Permission, Role } from "appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";
const UMKM_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_UMKM_COLLECTION_ID || "";
const SUGGESTIONS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_SUGGESTIONS_COLLECTION_ID || "";
const STORAGE_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || "umkm-images";
const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "";
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "";

const hasDbConfig = Boolean(DATABASE_ID && UMKM_COLLECTION_ID && databases);

// ============ TYPES ============

export interface UMKMDocument {
    $id?: string;
    name: string;
    category: string;
    description: string;
    address: string;
    phone: string;
    images: string[];
    latitude?: number;
    longitude?: number;
    status: "PENDING" | "APPROVED" | "REJECTED";
    rejection_reason?: string;
    owner_id: string;
    owner_name?: string;
    owner_email?: string;
    submitted_at: string;
    approved_at?: string;
    open_hours?: string;
    social_media?: string;
}

export interface SuggestionDocument {
    $id?: string;
    name: string;
    category: string;
    description: string;
    address: string;
    phone: string;
    images: string[];
    submitted_by: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    rejection_reason?: string;
    submitted_at: string;
    latitude?: number;
    longitude?: number;
}

// ============ UMKM CRUD ============

export async function createUMKM(data: Omit<UMKMDocument, "$id">): Promise<UMKMDocument> {
    if (hasDbConfig) {
        try {
            // Strip fields that don't exist in Appwrite schema
            const { owner_name, owner_email, ...appwriteData } = data;
            const doc = await databases!.createDocument(
                DATABASE_ID,
                UMKM_COLLECTION_ID,
                ID.unique(),
                appwriteData,
                [
                    Permission.read(Role.any()),
                    Permission.update(Role.user(data.owner_id)),
                    Permission.delete(Role.user(data.owner_id)),
                ]
            );
            return { ...data, $id: doc.$id } as UMKMDocument;
        } catch (err) {
            console.error("Appwrite createUMKM failed, falling back to localStorage:", err);
        }
    }

    // localStorage fallback
    const id = crypto.randomUUID();
    const item = {
        id,
        ownerId: data.owner_id,
        ownerName: data.owner_name || "",
        ownerEmail: data.owner_email || "",
        name: data.name,
        category: data.category,
        address: data.address,
        description: data.description,
        phone: data.phone,
        openHours: data.open_hours || "",
        socialMedia: data.social_media || "",
        createdAt: data.submitted_at,
        status: "pending",
    };

    const raw = localStorage.getItem("umkm-owner-submissions");
    const list = raw ? JSON.parse(raw) : [];
    const filtered = list.filter((s: { ownerId: string }) => s.ownerId !== data.owner_id);
    localStorage.setItem("umkm-owner-submissions", JSON.stringify([item, ...filtered]));

    // Also save per-owner key for redirect logic
    localStorage.setItem(`umkm-owner-submission-${data.owner_id}`, JSON.stringify(item));

    return { ...data, $id: id };
}

export async function getUMKMByOwnerId(ownerId: string): Promise<UMKMDocument | null> {
    if (hasDbConfig) {
        try {
            const res = await databases!.listDocuments(
                DATABASE_ID,
                UMKM_COLLECTION_ID,
                [Query.equal("owner_id", ownerId), Query.limit(1)]
            );
            if (res.documents.length > 0) {
                return res.documents[0] as unknown as UMKMDocument;
            }
            return null;
        } catch {
            return null;
        }
    }

    // localStorage fallback
    try {
        const raw = localStorage.getItem(`umkm-owner-submission-${ownerId}`);
        if (!raw) return null;
        const s = JSON.parse(raw);
        // Also check global list for latest status
        const globalRaw = localStorage.getItem("umkm-owner-submissions");
        const globalList = globalRaw ? JSON.parse(globalRaw) : [];
        const fromGlobal = globalList.find((g: { ownerId: string }) => g.ownerId === ownerId);
        const current = fromGlobal || s;

        return {
            $id: current.id,
            name: current.name,
            category: current.category,
            description: current.description,
            address: current.address,
            phone: current.phone || "",
            images: [],
            status: (current.status || "pending").toUpperCase() as "PENDING" | "APPROVED" | "REJECTED",
            rejection_reason: current.rejectReason,
            owner_id: current.ownerId,
            owner_name: current.ownerName,
            owner_email: current.ownerEmail,
            submitted_at: current.createdAt,
            open_hours: current.openHours,
            social_media: current.socialMedia,
            latitude: current.latitude,
            longitude: current.longitude,
        };
    } catch {
        return null;
    }
}

export async function getAllUMKMs(): Promise<UMKMDocument[]> {
    if (hasDbConfig) {
        try {
            const res = await databases!.listDocuments(
                DATABASE_ID,
                UMKM_COLLECTION_ID,
                [Query.orderDesc("submitted_at"), Query.limit(100)]
            );
            return res.documents as unknown as UMKMDocument[];
        } catch (err) {
            console.error("Appwrite getAllUMKMs failed:", err);
            return [];
        }
    }

    // localStorage fallback
    try {
        const raw = localStorage.getItem("umkm-owner-submissions");
        const list = raw ? JSON.parse(raw) : [];
        return list.map((s: Record<string, unknown>) => ({
            $id: s.id as string,
            name: s.name as string,
            category: s.category as string,
            description: s.description as string,
            address: s.address as string,
            phone: (s.phone as string) || "",
            images: [],
            latitude: s.latitude as number | undefined,
            longitude: s.longitude as number | undefined,
            status: ((s.status as string) || "pending").toUpperCase() as "PENDING" | "APPROVED" | "REJECTED",
            rejection_reason: s.rejectReason as string | undefined,
            owner_id: s.ownerId as string,
            owner_name: s.ownerName as string,
            owner_email: s.ownerEmail as string,
            submitted_at: s.createdAt as string,
            open_hours: s.openHours as string,
            social_media: s.socialMedia as string,
        }));
    } catch {
        return [];
    }
}

export async function getApprovedUMKMs(): Promise<UMKMDocument[]> {
    const results: UMKMDocument[] = [];

    if (hasDbConfig) {
        // Fetch from umkm collection
        try {
            const res = await databases!.listDocuments(
                DATABASE_ID,
                UMKM_COLLECTION_ID,
                [Query.equal("status", "APPROVED"), Query.limit(100)]
            );
            results.push(...(res.documents as unknown as UMKMDocument[]));
        } catch {
            // continue
        }

        // Also fetch approved suggestions and convert to UMKMDocument format
        if (SUGGESTIONS_COLLECTION_ID) {
            try {
                const sugRes = await databases!.listDocuments(
                    DATABASE_ID,
                    SUGGESTIONS_COLLECTION_ID,
                    [Query.equal("status", "APPROVED"), Query.limit(100)]
                );
                const converted: UMKMDocument[] = sugRes.documents.map((doc: Record<string, unknown>) => ({
                    $id: doc.$id as string,
                    name: (doc.name as string) || "",
                    category: (doc.category as string) || "Lainnya",
                    description: (doc.description as string) || "",
                    address: (doc.address as string) || "",
                    phone: (doc.phone as string) || "",
                    images: (doc.images as string[]) || [],
                    latitude: doc.latitude as number | undefined,
                    longitude: doc.longitude as number | undefined,
                    status: "APPROVED" as const,
                    owner_id: (doc.submitted_by as string) || "",
                    submitted_at: (doc.submitted_at as string) || "",
                }));
                results.push(...converted);
            } catch {
                // continue
            }
        }

        if (results.length > 0) return results;
    }

    // localStorage fallback
    const all = await getAllUMKMs();
    return all.filter((u) => u.status === "APPROVED");
}

export async function updateUMKMStatus(
    id: string,
    status: "APPROVED" | "REJECTED",
    rejectionReason?: string,
    coordinates?: { latitude: number; longitude: number }
): Promise<void> {
    if (hasDbConfig) {
        try {
            await databases!.updateDocument(DATABASE_ID, UMKM_COLLECTION_ID, id, {
                status,
                rejection_reason: rejectionReason || null,
                ...(coordinates || {}),
                ...(status === "APPROVED" ? { approved_at: new Date().toISOString() } : {}),
            });
            return;
        } catch (err) {
            console.error("Appwrite updateUMKMStatus failed:", err);
        }
    }

    // localStorage fallback
    try {
        const raw = localStorage.getItem("umkm-owner-submissions");
        const list = raw ? JSON.parse(raw) : [];
        const updated = list.map((s: Record<string, unknown>) => {
            if (s.id === id) {
                return {
                    ...s,
                    status: status.toLowerCase(),
                    rejectReason: rejectionReason || s.rejectReason,
                    ...(coordinates || {}),
                };
            }
            return s;
        });
        localStorage.setItem("umkm-owner-submissions", JSON.stringify(updated));

        // Also update per-owner key
        const item = updated.find((s: Record<string, unknown>) => s.id === id);
        if (item?.ownerId) {
            localStorage.setItem(`umkm-owner-submission-${item.ownerId}`, JSON.stringify(item));
        }
    } catch (err) {
        console.error("localStorage updateUMKMStatus failed:", err);
    }
}

// ============ SUGGESTIONS CRUD ============

export async function getAllSuggestions(): Promise<SuggestionDocument[]> {
    if (hasDbConfig && SUGGESTIONS_COLLECTION_ID) {
        try {
            const res = await databases!.listDocuments(
                DATABASE_ID,
                SUGGESTIONS_COLLECTION_ID,
                [Query.orderDesc("submitted_at"), Query.limit(100)]
            );
            return res.documents as unknown as SuggestionDocument[];
        } catch {
            return [];
        }
    }

    // localStorage fallback
    try {
        const raw = localStorage.getItem("umkm-upload-submissions");
        const list = raw ? JSON.parse(raw) : [];
        return list.map((s: Record<string, unknown>) => ({
            $id: s.id as string,
            name: s.name as string,
            category: s.category as string,
            description: (s.description as string) || "",
            address: s.address as string,
            phone: (s.phone as string) || "",
            images: s.imageUrl ? [s.imageUrl as string] : [],
            latitude: s.latitude as number | undefined,
            longitude: s.longitude as number | undefined,
            status: ((s.status as string) || "pending").toUpperCase() as "PENDING" | "APPROVED" | "REJECTED",
            rejection_reason: s.rejectReason as string | undefined,
            submitted_by: "",
            submitted_at: s.createdAt as string,
        }));
    } catch {
        return [];
    }
}

export async function updateSuggestionStatus(
    id: string,
    status: "APPROVED" | "REJECTED",
    rejectionReason?: string,
    coordinates?: { latitude: number; longitude: number }
): Promise<void> {
    if (hasDbConfig && SUGGESTIONS_COLLECTION_ID) {
        try {
            await databases!.updateDocument(DATABASE_ID, SUGGESTIONS_COLLECTION_ID, id, {
                status,
                rejection_reason: rejectionReason || null,
                ...(coordinates || {}),
            });
            return;
        } catch (err) {
            console.error("Appwrite updateSuggestionStatus failed:", err);
        }
    }

    // localStorage fallback
    try {
        const raw = localStorage.getItem("umkm-upload-submissions");
        const list = raw ? JSON.parse(raw) : [];
        const updated = list.map((s: Record<string, unknown>) =>
            s.id === id
                ? { ...s, status: status.toLowerCase(), rejectReason: rejectionReason || s.rejectReason, ...(coordinates || {}) }
                : s
        );
        localStorage.setItem("umkm-upload-submissions", JSON.stringify(updated));
    } catch (err) {
        console.error("localStorage updateSuggestionStatus failed:", err);
    }
}

export async function createSuggestion(
    data: Omit<SuggestionDocument, "$id">
): Promise<SuggestionDocument> {
    if (hasDbConfig && SUGGESTIONS_COLLECTION_ID) {
        try {
            const doc = await databases!.createDocument(
                DATABASE_ID,
                SUGGESTIONS_COLLECTION_ID,
                ID.unique(),
                data,
                [Permission.read(Role.any())]
            );
            return { ...data, $id: doc.$id };
        } catch (err) {
            console.error("Appwrite createSuggestion failed:", err);
        }
    }

    // localStorage fallback
    const id = crypto.randomUUID();
    const raw = localStorage.getItem("umkm-upload-submissions");
    const list = raw ? JSON.parse(raw) : [];
    list.unshift({
        id,
        name: data.name,
        category: data.category,
        address: data.address,
        description: data.description,
        phone: data.phone,
        createdAt: data.submitted_at,
        status: "pending",
        imageUrl: data.images[0] || "",
    });
    localStorage.setItem("umkm-upload-submissions", JSON.stringify(list));
    return { ...data, $id: id };
}

// ============ SINGLE UMKM BY ID ============

export async function getUMKMById(id: string): Promise<UMKMDocument | null> {
    if (hasDbConfig) {
        // Try umkm collection first
        try {
            const doc = await databases!.getDocument(DATABASE_ID, UMKM_COLLECTION_ID, id);
            return doc as unknown as UMKMDocument;
        } catch {
            // Not in umkm collection, try suggestions
        }

        // Try umkm_suggestions collection
        if (SUGGESTIONS_COLLECTION_ID) {
            try {
                const doc = await databases!.getDocument(DATABASE_ID, SUGGESTIONS_COLLECTION_ID, id);
                return {
                    $id: doc.$id,
                    name: (doc as Record<string, unknown>).name as string || "",
                    category: (doc as Record<string, unknown>).category as string || "Lainnya",
                    description: (doc as Record<string, unknown>).description as string || "",
                    address: (doc as Record<string, unknown>).address as string || "",
                    phone: (doc as Record<string, unknown>).phone as string || "",
                    images: ((doc as Record<string, unknown>).images as string[]) || [],
                    latitude: (doc as Record<string, unknown>).latitude as number | undefined,
                    longitude: (doc as Record<string, unknown>).longitude as number | undefined,
                    status: ((doc as Record<string, unknown>).status as string || "PENDING").toUpperCase() as "PENDING" | "APPROVED" | "REJECTED",
                    owner_id: (doc as Record<string, unknown>).submitted_by as string || "",
                    submitted_at: (doc as Record<string, unknown>).submitted_at as string || "",
                } as UMKMDocument;
            } catch {
                // Not found in suggestions either
            }
        }
    }

    // localStorage fallback
    try {
        const raw = localStorage.getItem("umkm-owner-submissions");
        const list = raw ? JSON.parse(raw) : [];
        const s = list.find((item: Record<string, unknown>) => item.id === id);
        if (!s) return null;
        return {
            $id: s.id as string,
            name: s.name as string,
            category: s.category as string,
            description: (s.description as string) || "",
            address: s.address as string,
            phone: (s.phone as string) || "",
            images: s.images ? (s.images as string[]) : [],
            latitude: s.latitude as number | undefined,
            longitude: s.longitude as number | undefined,
            status: ((s.status as string) || "pending").toUpperCase() as "PENDING" | "APPROVED" | "REJECTED",
            owner_id: s.ownerId as string,
            submitted_at: s.createdAt as string,
            open_hours: s.openHours as string,
            social_media: s.socialMedia as string,
        };
    } catch {
        return null;
    }
}

// ============ UPDATE UMKM DETAILS (owner edits) ============

export async function updateUMKMDetails(
    id: string,
    data: Partial<Pick<UMKMDocument, "description" | "phone" | "open_hours" | "social_media" | "images">>
): Promise<void> {
    // Build clean payload (no undefined values)
    const payload: Record<string, unknown> = {};
    if (data.description !== undefined) payload.description = data.description;
    if (data.phone !== undefined) payload.phone = data.phone;
    if (data.images !== undefined) payload.images = data.images;
    if (data.open_hours !== undefined) payload.open_hours = data.open_hours;
    if (data.social_media !== undefined) payload.social_media = data.social_media;

    if (Object.keys(payload).length === 0) return;

    if (hasDbConfig) {
        try {
            console.log("Updating UMKM doc:", id, "payload:", payload);
            await databases!.updateDocument(DATABASE_ID, UMKM_COLLECTION_ID, id, payload);
            console.log("Appwrite updateUMKMDetails succeeded");
            return;
        } catch (err: unknown) {
            console.error("Appwrite updateUMKMDetails failed:", err);

            // If "Unknown attribute" error, try sending only known-safe fields one by one
            const errMsg = err instanceof Error ? err.message : String(err);
            if (errMsg.includes("Unknown attribute")) {
                console.log("Retrying with individual fields...");
                for (const [key, val] of Object.entries(payload)) {
                    try {
                        await databases!.updateDocument(DATABASE_ID, UMKM_COLLECTION_ID, id, { [key]: val });
                        console.log(`  ✅ Updated field: ${key}`);
                    } catch (fieldErr) {
                        console.warn(`  ❌ Skipped field: ${key}`, fieldErr);
                    }
                }
                return;
            }
        }
    }

    // localStorage fallback
    try {
        const raw = localStorage.getItem("umkm-owner-submissions");
        const list = raw ? JSON.parse(raw) : [];
        const updated = list.map((s: Record<string, unknown>) => {
            if (s.id === id) {
                return {
                    ...s,
                    description: data.description ?? s.description,
                    phone: data.phone ?? s.phone,
                    openHours: data.open_hours ?? s.openHours,
                    socialMedia: data.social_media ?? s.socialMedia,
                    images: data.images ?? s.images,
                };
            }
            return s;
        });
        localStorage.setItem("umkm-owner-submissions", JSON.stringify(updated));

        // Sync per-owner key
        const item = updated.find((s: Record<string, unknown>) => s.id === id);
        if (item?.ownerId) {
            localStorage.setItem(`umkm-owner-submission-${item.ownerId}`, JSON.stringify(item));
        }
    } catch (err) {
        console.error("localStorage updateUMKMDetails failed:", err);
    }
}

// ============ IMAGE UPLOAD (Appwrite Storage) ============

export async function uploadUMKMImage(file: File): Promise<string> {
    if (!storage) {
        throw new Error("Appwrite Storage not configured");
    }

    const fileId = ID.unique();
    await storage.createFile(
        STORAGE_BUCKET_ID,
        fileId,
        file,
        [
            Permission.read(Role.any()),
            Permission.write(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ]
    );

    // Return direct view URL
    const url = `${APPWRITE_ENDPOINT}/storage/buckets/${STORAGE_BUCKET_ID}/files/${fileId}/view?project=${APPWRITE_PROJECT_ID}`;
    return url;
}

export async function deleteUMKMImage(fileUrl: string): Promise<void> {
    if (!storage) return;
    // Extract file ID from URL: .../files/{fileId}/view?...
    const match = fileUrl.match(/\/files\/([^/]+)\/view/);
    if (!match) return;
    try {
        await storage.deleteFile(STORAGE_BUCKET_ID, match[1]);
    } catch (err) {
        console.warn("Failed to delete image:", err);
    }
}
