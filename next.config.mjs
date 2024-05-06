/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['www.smashbros.com'],
    },
    webpack: (config, { isServer }) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            sharp$: false,
            "onnxruntime-node$": false,
        };
        return config;
    },
    
};

export default nextConfig;
