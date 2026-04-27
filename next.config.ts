import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Agrega aquí los dominios reales de tus imágenes antes de ir a producción.
      // Usar hostname: "**" permite cualquier origen y es un riesgo de seguridad.
      // Ejemplos:
      //   { protocol: "https", hostname: "cdn.paraguayandev.com" },
      //   { protocol: "https", hostname: "res.cloudinary.com" },
      //   { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**" }, // TODO: restringir antes de producción
      { protocol: "http", hostname: "localhost" },
    ],
  },
};

export default nextConfig;
