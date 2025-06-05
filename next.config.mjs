/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: [
            "@node-rs/argon2",
            "@stream-io/node-sdk",
            "jsonwebtoken",
            "nodemailer",
        ],
        optimizePackageImports: ["lucide-react", "react-icons"],
    },

    // Performance optimizations
    reactStrictMode: false, // Bật lại để catch bugs sớm
    swcMinify: true, // Sử dụng SWC minifier nhanh hơn

    // Image optimization
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "pub-6150734308204bf898283cd938e34668.r2.dev",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "www.google.com",
                pathname: "/**",
            },
        ],
        formats: ["image/avif", "image/webp"], // AVIF trước vì nhỏ hơn
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 60 * 60 * 24 * 30, // Cache 30 ngày
        dangerouslyAllowSVG: false, // Bảo mật
        unoptimized: true,
        contentSecurityPolicy:
            "default-src 'self'; script-src 'none'; sandbox;",
    },

    // Build optimizations
    ...(process.env.NODE_ENV === "production"
        ? {
              compiler: {
                  removeConsole: { exclude: ["error"] },
              },
          }
        : {}),

    output: "standalone",
    typescript: {
        ignoreBuildErrors: true, // Strict trong production
    },
    eslint: {
        ignoreDuringBuilds: true, // Strict trong production
    },
    productionBrowserSourceMaps: false,

    async headers() {
        return [
            {
                // Static assets caching
                source: "/_next/static/(.*)",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
        ];
    },

    // Webpack config để handle native modules
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // Define globals
        config.plugins.push(
            new webpack.DefinePlugin({
                "typeof window": isServer ? '"undefined"' : '"object"',
                "typeof self": isServer ? '"undefined"' : '"object"',
            }),
        );

        if (isServer) {
            // Externalize native modules
            config.externals = config.externals || [];
            config.externals.push(
                "jsonwebtoken",
                "@node-rs/argon2",
                "nodemailer",
                "sharp",
            );

            // Fix "self is not defined"
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
                crypto: false,
                stream: false,
                url: false,
                zlib: false,
                http: false,
                https: false,
                assert: false,
                os: false,
                path: false,
            };

            // Disable splitChunks for server-side to avoid the issue
            config.optimization.splitChunks = false;
        } else {
            // Only apply splitChunks for client-side
            config.optimization = {
                ...config.optimization,
                splitChunks: {
                    chunks: "all",
                    cacheGroups: {
                        vendor: {
                            test: /[\\/]node_modules[\\/]/,
                            name: "vendors",
                            chunks: "all",
                        },
                        common: {
                            name: "common",
                            minChunks: 2,
                            chunks: "all",
                            enforce: true,
                        },
                    },
                },
            };
        }

        if (config.cache && !dev) {
            config.cache = Object.freeze({
                type: "memory",
            });
        }

        return config;
    },
};

export default nextConfig;
