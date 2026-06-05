// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   /* config options here */
// };

// export default nextConfig;

// // next.config.js
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: ['hinansho-client-portal-backend.onrender.com'],
//   },
// }

// module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Render deployment (https)
      {
        protocol: 'https',
        hostname: 'hinansho-client-portal-backend.onrender.com',
      },
      // Local development (http)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '7500',
      },
      // Cloudinary (for uploaded property/profile images)
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
}

export default nextConfig  // ✅ ES module syntax for .mjs