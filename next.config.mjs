/** @type {import('next').NextConfig} */
const nextConfig = {

    devIndicators: false,


    // webpack: (config, { isServer }) => {
    //     // Habilita logging extenso solo en desarrollo
    //     if (!isServer && process.env.NODE_ENV !== 'production') {
    //         config.infrastructureLogging = {
    //             level: 'verbose',
    //             colors: true
    //         };
    //     }
    //     return config;
    // },

    async headers() {
        return [
            {
                // matching all API routes
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "https://54gzmtrv-3000.use2.devtunnels.ms" }, // replace this your actual origin
                    { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
                    { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
                ]
            }
        ]
    }
};

export default nextConfig;

