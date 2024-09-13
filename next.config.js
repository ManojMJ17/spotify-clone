/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ["hmotpedwoenbcogcbixp.supabase.co"],
	},

	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
};

export default nextConfig;
