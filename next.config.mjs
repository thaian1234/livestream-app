/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: [
            "@node-rs/argon2",
            "@stream-io/node-sdk",
            "jsonwebtoken",
        ],
    },
    reactStrictMode: false,
    images: {
        domains: [
            "lh3.googleusercontent.com",
            "pub-6150734308204bf898283cd938e34668.r2.dev",
            "www.google.com",
        ],
        formats: ["image/webp", "image/avif"],
        unoptimized: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    output: "standalone",
    productionBrowserSourceMaps: false,

    // Tối ưu memory cho build process
    experimental: {
        workerThreads: false,
        cpus: 1,
        // Thêm config này để handle native modules
        esmExternals: "loose",
    },

    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },

    // Webpack config để handle native modules
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        if (isServer) {
            // Externalize native modules
            config.externals = config.externals || [];
            config.externals.push("jsonwebtoken");
            config.externals.push("@node-rs/argon2");

            // Fix "self is not defined"
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
            };
        }

        // Define globals
        config.plugins.push(
            new webpack.DefinePlugin({
                "typeof window": isServer ? '"undefined"' : '"object"',
                "typeof self": isServer ? '"undefined"' : '"object"',
            }),
        );

        if (config.cache && !dev) {
            config.cache = Object.freeze({
                type: "memory",
            });
        }

        return config;
    },
};

export default nextConfig;
