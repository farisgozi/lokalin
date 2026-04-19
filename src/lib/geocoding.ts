/**
 * Geocoding utility using Nominatim (OpenStreetMap).
 * Free, no API key required.
 * Rate limit: 1 request/second — we throttle automatically.
 */

interface GeocodingResult {
    latitude: number;
    longitude: number;
    displayName: string;
}

let lastRequestTime = 0;

async function throttle(): Promise<void> {
    const now = Date.now();
    const elapsed = now - lastRequestTime;
    if (elapsed < 1100) {
        await new Promise((resolve) => setTimeout(resolve, 1100 - elapsed));
    }
    lastRequestTime = Date.now();
}

export async function geocodeAddress(
    address: string
): Promise<GeocodingResult | null> {
    if (!address || address.trim().length < 5) return null;

    try {
        await throttle();

        const params = new URLSearchParams({
            q: address,
            format: "json",
            limit: "1",
            countrycodes: "id", // Indonesia
        });

        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?${params.toString()}`,
            {
                headers: {
                    "User-Agent": "UMKMKita/1.0 (project-lomba)",
                    Accept: "application/json",
                },
            }
        );

        if (!res.ok) {
            console.error(`Geocoding failed: ${res.status} ${res.statusText}`);
            return null;
        }

        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
            console.warn(`Geocoding: no results for "${address}"`);
            return null;
        }

        const result = data[0];
        return {
            latitude: parseFloat(result.lat),
            longitude: parseFloat(result.lon),
            displayName: result.display_name || address,
        };
    } catch (err) {
        console.error("Geocoding error:", err);
        return null;
    }
}
