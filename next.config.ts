import type { NextConfig } from "next";


const nextConfig: NextConfig = {
	output: "standalone",
	images: {
		domains: [
			"firebasestorage.googleapis.com",
			"media.tryinteract.com"
		],
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
};

export default nextConfig;
