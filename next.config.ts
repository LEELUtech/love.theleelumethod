import type { NextConfig } from "next";


const nextConfig: NextConfig = {
	output: "standalone",
	serverExternalPackages: ['stripe', 'google-libphonenumber'],
	images: {
		domains: [
			"firebasestorage.googleapis.com",
			"leelu-tech.firebasestorage.app",
			"media.tryinteract.com"
		],
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
