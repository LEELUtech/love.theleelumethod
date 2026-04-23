import type { NextConfig } from "next";


const nextConfig: NextConfig = {
	async redirects() {
		return [
			{
				source: "/:path*",
				destination: "https://love.theleelumethod.com/:path*",
				permanent: true,
				has: [{ type: "host", value: "theleelumethod.com" }],
			},
			{
				source: "/:path*",
				destination: "https://love.theleelumethod.com/:path*",
				permanent: true,
				has: [{ type: "host", value: "www.theleelumethod.com" }],
			},
			{
				source: "/:path*",
				destination: "https://love.theleelumethod.com/:path*",
				permanent: true,
				has: [{ type: "header", key: "x-forwarded-host", value: "theleelumethod.com" }],
			},
			{
				source: "/:path*",
				destination: "https://love.theleelumethod.com/:path*",
				permanent: true,
				has: [{ type: "header", key: "x-forwarded-host", value: "www.theleelumethod.com" }],
			},
		];
	},
	output: "standalone",
	serverExternalPackages: ['stripe', 'google-libphonenumber'],
	images: {
		domains: [
			"firebasestorage.googleapis.com",
			"leelu-tech.firebasestorage.app",
			"media.tryinteract.com"
		],
		formats: ['image/avif', 'image/webp'],
		qualities: [25, 50, 75, 85, 90, 100],
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
};

export default nextConfig;
