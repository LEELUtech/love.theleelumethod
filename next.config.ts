import type { NextConfig } from "next";


const nextConfig: NextConfig = {
	output: "standalone",
	images: {
		domains: [
			"firebasestorage.googleapis.com",
			"media.tryinteract.com"
		],
		qualities: [25, 50, 75, 90, 100],
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
};

export default nextConfig;
