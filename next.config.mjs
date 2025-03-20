/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: [
            "@node-rs/argon2",
            "@stream-io/node-sdk",
        ],
    },
    reactStrictMode: false,
    images: {
        domains: [
            "lh3.googleusercontent.com",
            "pub-6150734308204bf898283cd938e34668.r2.dev",
            "www.google.com",
        ],
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
