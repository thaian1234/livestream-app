/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: [
            "@node-rs/argon2",
            "@stream-io/node-sdk",
        ],
    },
    reactStrictMode: false,
};

export default nextConfig;
