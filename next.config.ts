import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // GitHub Pages用の設定
    output: 'export',
    basePath: '/obb8-studio',
    assetPrefix: '/obb8-studio',
    images: {
        unoptimized: true,
    },
    trailingSlash: true,
};

export default nextConfig;
