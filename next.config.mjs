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
        domains: ["lh3.googleusercontent.com"], // Thêm domain của Google cho phép dùng trong src của next/image
    },
};

export default nextConfig;
