export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NODE_ENV === "production"
    ? (() => {
        throw new Error(
          "[SEO] NEXT_PUBLIC_SITE_URL no está definida. " +
          "Los canonical tags y el sitemap apuntarán a localhost. " +
          "Configura la variable de entorno antes de hacer deploy."
        );
      })()
    : "http://localhost:3000");
