import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

interface Payload {
    businessName?: string;
    trend?: number[];
    labels?: string[];
    averageRating?: number;
    totalReviews?: number;
    recentReviews?: { rating: number; comment: string; date: string }[];
}

function fallbackAnalysis(name: string, trend: number[]) {
    if (trend.length < 2) {
        return `${name}: data rating belum cukup untuk dianalisis.`;
    }

    const first = trend[0];
    const last = trend[trend.length - 1];
    const avg = trend.reduce((acc, n) => acc + n, 0) / trend.length;
    const direction = last >= first ? "meningkat" : "menurun";

    return [
        `Ringkasan performa ${name}:`,
        `- Rating rata-rata saat ini ${avg.toFixed(2)}.`,
        `- Tren rating ${direction} dari ${first.toFixed(1)} ke ${last.toFixed(1)}.`,
        "- Rekomendasi: pertahankan konsistensi kualitas produk dan respon ulasan negatif maksimal 24 jam.",
    ].join("\n");
}

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as Payload;
        const trend = Array.isArray(body.trend) ? body.trend : [];
        const labels = Array.isArray(body.labels) ? body.labels : [];
        const businessName = body.businessName || "UMKM";
        const avgRating = body.averageRating ?? 0;
        const totalReviews = body.totalReviews ?? 0;
        const reviews = Array.isArray(body.recentReviews) ? body.recentReviews : [];

        if (trend.length === 0) {
            return NextResponse.json({ error: "Data trend tidak boleh kosong" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ analysis: fallbackAnalysis(businessName, trend), source: "fallback" });
        }

        const ai = new GoogleGenAI({ apiKey });

        // Build review context
        const reviewContext = reviews.length > 0
            ? `\nUlasan terbaru:\n${reviews.map(r => `- Bintang ${r.rating}: "${r.comment || '(tanpa komentar)'}"`).join("\n")}`
            : "";

        const prompt = `Anda adalah analis performa UMKM Indonesia.\nNama UMKM: ${businessName}\nRating rata-rata: ${avgRating.toFixed(1)} dari ${totalReviews} ulasan\nLabel periode: ${labels.join(", ")}\nData trend rating individual: ${trend.join(", ")}${reviewContext}\n\nTugas:\n1) Ringkas tren rating dalam 2 kalimat berdasarkan DATA ASLI di atas.\n2) Berikan 3 insight penyebab potensial berdasarkan rating dan komentar pelanggan.\n3) Berikan 3 aksi prioritas untuk menaikkan rating bulan depan.\nJawab bahasa Indonesia, ringkas, pakai bullet.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const text = response.text?.trim();
        if (!text) {
            return NextResponse.json({ analysis: fallbackAnalysis(businessName, trend), source: "fallback" });
        }

        return NextResponse.json({ analysis: text, source: "gemini" });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
