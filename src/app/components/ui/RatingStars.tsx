"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
    value: number;
    onChange?: (value: number) => void;
    size?: "sm" | "md" | "lg";
    readOnly?: boolean;
    showValue?: boolean;
    count?: number;
}

export default function RatingStars({
    value,
    onChange,
    size = "md",
    readOnly = false,
    showValue = false,
    count,
}: RatingStarsProps) {
    const [hoverValue, setHoverValue] = useState(0);

    const sizeMap = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8",
    };

    const starSize = sizeMap[size];

    return (
        <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => {
                    const filled = readOnly
                        ? star <= Math.round(value)
                        : star <= (hoverValue || value);
                    const halfFilled = readOnly && !filled && star - 0.5 <= value;

                    return (
                        <button
                            key={star}
                            type="button"
                            disabled={readOnly}
                            onClick={() => onChange?.(star)}
                            onMouseEnter={() => !readOnly && setHoverValue(star)}
                            onMouseLeave={() => !readOnly && setHoverValue(0)}
                            className={`transition-all duration-200 ${readOnly
                                    ? "cursor-default"
                                    : "cursor-pointer hover:scale-110 active:scale-95"
                                }`}
                        >
                            <Star
                                className={`${starSize} transition-colors duration-200 ${filled
                                        ? "fill-yellow-400 text-yellow-400"
                                        : halfFilled
                                            ? "fill-yellow-400/50 text-yellow-400"
                                            : "fill-gray-200 text-gray-200"
                                    } ${!readOnly && hoverValue >= star
                                        ? "fill-yellow-400 text-yellow-400 drop-shadow-md"
                                        : ""
                                    }`}
                            />
                        </button>
                    );
                })}
            </div>
            {showValue && (
                <span className="text-sm font-semibold text-gray-700 ml-1">
                    {value.toFixed(1)}
                </span>
            )}
            {count !== undefined && (
                <span className="text-sm text-gray-500">({count})</span>
            )}
        </div>
    );
}
