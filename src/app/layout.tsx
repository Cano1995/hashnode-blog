import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const AUTHOR = "Cristhian Cano Bogado";
const DESCRIPTION =
  "Blog de Cristhian Cano Bogado sobre Oracle APEX, migración de Oracle Forms, desarrollo de aplicaciones empresariales y bases de datos.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Paraguayan Dev",
    template: "%s | Paraguayan Dev",
  },
  description: DESCRIPTION,
  authors: [{ name: AUTHOR, url: "https://www.linkedin.com/in/cristhian-cano-bogado-orclapex-86473713b/" }],
  creator: AUTHOR,
  openGraph: {
    siteName: "Paraguayan Dev",
    locale: "es_PY",
    type: "website",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    creator: "@paraguayandev",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <head />
      <body className="min-h-screen flex flex-col">
        <Script src="/theme-init.js" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  );
}
