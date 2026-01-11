/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
                port: '',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 'placehold.co',
                port: '',
                pathname: '/**'
            }
        ]
    },
    // Disable source maps in development to save memory
    productionBrowserSourceMaps: false,
    // Configure webpack to use less memory
    webpack: (config, { dev }) => {
        // Reduce memory footprint
        config.optimization = {
            ...config.optimization,
            removeAvailableModules: true,
            removeEmptyChunks: true,
            mergeDuplicateChunks: true,
            flagIncludedChunks: true,
        };

        return config;
    }
};

export default nextConfig;