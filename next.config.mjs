/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exporta el sitio como archivos estáticos en la carpeta "out"
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
};

export default nextConfig;
