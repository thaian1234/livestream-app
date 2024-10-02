/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ["@node-rs/argon2"],
    },
    reactStrictMode: true,
};

export default nextConfig;
