class BlurDataURLCache {
    private cache = new Map<string, { url: string; timestamp: number }>();
    private readonly TTL = 5 * 60 * 1000; // 5 minutes

    get(key: string): string | null {
        const cached = this.cache.get(key);
        if (!cached) return null;

        // Check if expired
        if (Date.now() - cached.timestamp > this.TTL) {
            this.cache.delete(key);
            return null;
        }

        return cached.url;
    }

    set(key: string, url: string): void {
        this.cache.set(key, { url, timestamp: Date.now() });

        // Clean up old entries if cache gets too large
        if (this.cache.size > 100) {
            const oldestKey = this.cache.keys().next().value;
            if (oldestKey) {
                this.cache.delete(oldestKey);
            }
        }
    }
}

const blurCache = new BlurDataURLCache();

// Optimized blur data URL generators
class BlurDataURLGenerator {
    // Generate SVG blur with customizable colors and effects
    private static createSVGBlur(
        width: number = 16,
        height: number = 9,
        colors: string[] = ["#374151", "#4B5563"],
        hasNoise: boolean = false,
    ): string {
        const gradientStops = colors
            .map(
                (color, index) =>
                    `<stop offset="${(index * 100) / (colors.length - 1)}%" stop-color="${color}"/>`,
            )
            .join("");

        const noiseFilter = hasNoise
            ? `
            <filter id="noise">
                <feTurbulence baseFrequency="0.9" numOctaves="1" result="noise"/>
                <feColorMatrix in="noise" type="saturate" values="0"/>
                <feComponentTransfer>
                    <feFuncA type="discrete" tableValues="0.1"/>
                </feComponentTransfer>
                <feComposite operator="over" in2="SourceGraphic"/>
            </filter>
        `
            : "";

        const svg = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        ${gradientStops}
                    </linearGradient>
                    ${noiseFilter}
                </defs>
                <rect width="100%" height="100%" fill="url(#grad)" ${hasNoise ? 'filter="url(#noise)"' : ""}/>
            </svg>
        `;

        return `data:image/svg+xml;base64,${btoa(svg)}`;
    }

    // Extract theme colors based on URL patterns
    private static getThemeColors(imageUrl: string): {
        colors: string[];
        hasNoise: boolean;
    } {
        const url = imageUrl.toLowerCase();

        // Gaming theme
        if (
            url.includes("gaming") ||
            url.includes("game") ||
            url.includes("esports")
        ) {
            return {
                colors: ["#1a1a2e", "#16213e", "#0f3460"],
                hasNoise: true,
            };
        }

        // Music/Entertainment theme
        if (
            url.includes("music") ||
            url.includes("concert") ||
            url.includes("entertainment")
        ) {
            return {
                colors: ["#4c1d95", "#5b21b6", "#7c3aed"],
                hasNoise: false,
            };
        }

        // Sports theme
        if (
            url.includes("sport") ||
            url.includes("football") ||
            url.includes("basketball")
        ) {
            return {
                colors: ["#064e3b", "#065f46", "#047857"],
                hasNoise: false,
            };
        }

        // Tech/Coding theme
        if (
            url.includes("tech") ||
            url.includes("code") ||
            url.includes("programming")
        ) {
            return {
                colors: ["#0c4a6e", "#0369a1", "#0284c7"],
                hasNoise: true,
            };
        }

        // Art/Creative theme
        if (
            url.includes("art") ||
            url.includes("design") ||
            url.includes("creative")
        ) {
            return {
                colors: ["#7c2d12", "#9a3412", "#c2410c"],
                hasNoise: false,
            };
        }

        // Default theme
        return {
            colors: ["#374151", "#4b5563", "#6b7280"],
            hasNoise: false,
        };
    }

    // Generate CDN-optimized blur URL
    private static generateCDNBlur(imageUrl: string): string | null {
        try {
            // Vercel/Next.js Image optimization
            if (imageUrl.includes("_next/image") || imageUrl.startsWith("/")) {
                return `/_next/image?url=${encodeURIComponent(imageUrl)}&w=16&q=10`;
            }

            // Generic CDN with query params
            if (imageUrl.includes("cdn.") || imageUrl.includes("r2.dev")) {
                const url = new URL(imageUrl);
                url.searchParams.set("w", "16");
                url.searchParams.set("h", "9");
                url.searchParams.set("q", "10");
                url.searchParams.set("blur", "3");
                return url.toString();
            }
        } catch (error) {
            console.warn("CDN blur generation failed:", error);
        }

        return null;
    }

    // Main generation method
    static generate(imageUrl: string | null): string {
        // Handle null/empty URLs
        if (!imageUrl?.trim()) {
            return this.createSVGBlur(16, 9, ["#374151", "#4b5563"]);
        }

        // Check cache first
        const cached = blurCache.get(imageUrl);
        if (cached) return cached;

        let blurDataURL: string;

        // Try CDN-optimized blur first
        const cdnBlur = this.generateCDNBlur(imageUrl);
        if (cdnBlur) {
            blurDataURL = cdnBlur;
        } else {
            // Fallback to themed SVG blur
            const { colors, hasNoise } = this.getThemeColors(imageUrl);
            blurDataURL = this.createSVGBlur(16, 9, colors, hasNoise);
        }

        // Cache the result
        blurCache.set(imageUrl, blurDataURL);
        return blurDataURL;
    }

    // Preload blur for critical images
    static preload(imageUrls: string[]): void {
        imageUrls.forEach((url) => {
            if (url && !blurCache.get(url)) {
                // Generate in background
                requestIdleCallback(() => {
                    this.generate(url);
                });
            }
        });
    }
}

export function generateOptimizedBlurDataURL(imageUrl: string | null): string {
    return BlurDataURLGenerator.generate(imageUrl);
}
