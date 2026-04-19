"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Lightbulb,
    BarChart3,
    CheckCircle2,
    Target,
} from "lucide-react";

interface AIAnalyticsResponseProps {
    text: string;
}

interface Section {
    title: string;
    type: "summary" | "insight" | "action" | "general";
    items: string[];
}

function parseAIResponse(text: string): Section[] {
    const lines = text.split("\n").filter((l) => l.trim());
    const sections: Section[] = [];
    let currentSection: Section | null = null;

    for (const line of lines) {
        const trimmed = line.trim();

        // Detect section headers like **1) Title:** or **Title:**
        const headerMatch = trimmed.match(
            /^\*{0,2}\d*\)?\s*\*{0,2}(.*?)\*{0,2}:?\*{0,2}\s*$/
        );
        if (
            headerMatch &&
            (trimmed.includes("**") || trimmed.match(/^\d+\)/)) &&
            trimmed.length < 80
        ) {
            const title = headerMatch[1]
                .replace(/\*+/g, "")
                .replace(/^\d+\)\s*/, "")
                .trim();

            let type: Section["type"] = "general";
            const lower = title.toLowerCase();
            if (lower.includes("ringkasan") || lower.includes("tren") || lower.includes("overview"))
                type = "summary";
            else if (
                lower.includes("insight") ||
                lower.includes("penyebab") ||
                lower.includes("analisis") ||
                lower.includes("temuan")
            )
                type = "insight";
            else if (
                lower.includes("aksi") ||
                lower.includes("rekomendasi") ||
                lower.includes("saran") ||
                lower.includes("prioritas") ||
                lower.includes("langkah")
            )
                type = "action";

            if (currentSection && currentSection.items.length > 0) {
                sections.push(currentSection);
            }
            currentSection = { title, type, items: [] };
            continue;
        }

        // Content lines
        const content = trimmed
            .replace(/^\*\s+/, "")
            .replace(/^-\s+/, "")
            .replace(/^•\s+/, "")
            .trim();

        if (content && content.length > 5) {
            if (currentSection) {
                currentSection.items.push(content);
            } else {
                // Pre-section intro text
                if (!sections.length) {
                    currentSection = {
                        title: "Ringkasan",
                        type: "summary",
                        items: [content],
                    };
                }
            }
        }
    }

    if (currentSection && currentSection.items.length > 0) {
        sections.push(currentSection);
    }

    // Fallback: if parsing failed, show as single section
    if (sections.length === 0) {
        sections.push({
            title: "Analisis",
            type: "general",
            items: [text],
        });
    }

    return sections;
}

function highlightNumbers(text: string): React.ReactNode {
    const parts = text.split(
        /(\d+[.,]?\d*%?|\d+[.,]\d+)/g
    );

    return parts.map((part, i) => {
        if (/^\d+[.,]?\d*%?$/.test(part) || /^\d+[.,]\d+$/.test(part)) {
            return (
                <span
                    key={i}
                    className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-orange-100 text-orange-700 font-bold text-xs mx-0.5"
                >
                    {part}
                </span>
            );
        }
        // Bold markdown
        const boldParts = part.split(/\*\*(.*?)\*\*/g);
        if (boldParts.length > 1) {
            return boldParts.map((bp, j) =>
                j % 2 === 1 ? (
                    <strong key={`${i}-${j}`} className="font-semibold text-gray-800">
                        {bp}
                    </strong>
                ) : (
                    <span key={`${i}-${j}`}>{bp}</span>
                )
            );
        }
        return part;
    });
}

const sectionConfig = {
    summary: {
        icon: BarChart3,
        gradient: "from-blue-500 to-indigo-500",
        cardBg: "bg-blue-50/50",
        border: "border-blue-100",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        badgeText: "Ringkasan",
        badgeBg: "bg-blue-100 text-blue-700",
    },
    insight: {
        icon: Lightbulb,
        gradient: "from-amber-500 to-orange-500",
        cardBg: "bg-amber-50/50",
        border: "border-amber-100",
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
        badgeText: "Insight",
        badgeBg: "bg-amber-100 text-amber-700",
    },
    action: {
        icon: Target,
        gradient: "from-emerald-500 to-green-500",
        cardBg: "bg-emerald-50/50",
        border: "border-emerald-100",
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-600",
        badgeText: "Rekomendasi",
        badgeBg: "bg-emerald-100 text-emerald-700",
    },
    general: {
        icon: CheckCircle2,
        gradient: "from-gray-500 to-slate-500",
        cardBg: "bg-gray-50/50",
        border: "border-gray-100",
        iconBg: "bg-gray-100",
        iconColor: "text-gray-600",
        badgeText: "Info",
        badgeBg: "bg-gray-100 text-gray-700",
    },
};

export default function AIAnalyticsResponse({ text }: AIAnalyticsResponseProps) {
    const sections = useMemo(() => parseAIResponse(text), [text]);

    return (
        <div className="space-y-4">
            {sections.map((section, idx) => {
                const config = sectionConfig[section.type];
                const Icon = config.icon;

                return (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`rounded-xl border ${config.border} ${config.cardBg} overflow-hidden`}
                    >
                        {/* Section Header */}
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100/50">
                            <div
                                className={`w-8 h-8 rounded-lg ${config.iconBg} flex items-center justify-center`}
                            >
                                <Icon className={`w-4 h-4 ${config.iconColor}`} />
                            </div>
                            <h4 className="text-sm font-bold text-gray-800 flex-1">
                                {section.title}
                            </h4>
                            <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${config.badgeBg}`}
                            >
                                {config.badgeText}
                            </span>
                        </div>

                        {/* Section Items */}
                        <div className="px-4 py-3 space-y-2.5">
                            {section.items.map((item, iIdx) => {
                                // Detect sentiment for bullet icon
                                const lower = item.toLowerCase();
                                const isPositive =
                                    lower.includes("peningkatan") ||
                                    lower.includes("meningkat") ||
                                    lower.includes("positif") ||
                                    lower.includes("baik") ||
                                    lower.includes("berhasil");
                                const isNegative =
                                    lower.includes("penurunan") ||
                                    lower.includes("menurun") ||
                                    lower.includes("isu") ||
                                    lower.includes("masalah") ||
                                    lower.includes("perhatian");

                                return (
                                    <div
                                        key={iIdx}
                                        className="flex items-start gap-2.5 text-sm text-gray-700 leading-relaxed"
                                    >
                                        <span className="mt-0.5 flex-shrink-0">
                                            {isPositive ? (
                                                <TrendingUp className="w-4 h-4 text-emerald-500" />
                                            ) : isNegative ? (
                                                <AlertTriangle className="w-4 h-4 text-amber-500" />
                                            ) : (
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5" />
                                            )}
                                        </span>
                                        <span>{highlightNumbers(item)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
