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
        preloadEntriesOnStart: false,
        serverSourceMaps: false,
        webpackBuildWorker: true,
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
        loader: "default",
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
        ignoreBuildErrors: false, // Strict trong production
    },
    eslint: {
        ignoreDuringBuilds: true, // Strict trong production
    },
    productionBrowserSourceMaps: false,

    async headers() {
        return [
            {
                source: "/_next/static/(.*)",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
            {
                source: "/_next/image(.*)",
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
        }

        // Webpack optimizations
        webpack: (
            config,
            { buildId, dev, isServer, defaultLoaders, webpack },
        ) => {
            // Define globals
            config.plugins.push(
                new webpack.DefinePlugin({
                    "typeof window": isServer ? '"undefined"' : '"object"',
                    "typeof self": isServer ? '"undefined"' : '"object"',
                    __DEV__: dev,
                    __PROD__: !dev,
                }),
            );

            // Server-side externals
            if (isServer) {
                config.externals = config.externals || [];
                config.externals.push(
                    "jsonwebtoken",
                    "@node-rs/argon2",
                    "nodemailer",
                    "sharp",
                );
            }

            // Optimize bundle splitting
            if (!dev && !isServer) {
                config.optimization = {
                    ...config.optimization,
                    splitChunks: {
                        chunks: "all",
                        cacheGroups: {
                            vendor: {
                                test: /[\\/]node_modules[\\/]/,
                                name: "vendors",
                                priority: 10,
                                reuseExistingChunk: true,
                            },
                            common: {
                                name: "common",
                                minChunks: 2,
                                priority: 5,
                                reuseExistingChunk: true,
                            },
                            // Separate chunk for large libraries
                            react: {
                                test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                                name: "react",
                                priority: 20,
                            },
                            // Separate chunk for UI libraries
                            ui: {
                                test: /[\\/]node_modules[\\/](@radix-ui|lucide-react)[\\/]/,
                                name: "ui",
                                priority: 15,
                            },
                        },
                    },
                };
            }
        };

        if (config.cache && !dev) {
            config.cache = Object.freeze({
                type: "memory",
            });
        }

        return config;
    },
};

export default nextConfig;
