const nextConfig = {
	productionBrowserSourceMaps: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
			},
		],
	},
	typescript: {
		ignoreBuildErrors: false,
	},
	eslint: {
		ignoreDuringBuilds: false,
	},
	output: 'standalone',
	experimental: {
		serverActions: true,
		middlewarePrefetch: 'flexible',
	},
};

module.exports = nextConfig;
