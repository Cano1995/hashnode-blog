import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/siteUrl";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const AUTHOR = "Cristhian Cano Bogado";
const DESCRIPTION =
  "Blog de Cristhian Cano Bogado sobre Oracle APEX, migración de Oracle Forms, desarrollo de aplicaciones empresariales y bases de datos.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Oracle APEX, Oracle Forms y Desarrollo Empresarial | Paraguayan Dev",
    template: "%s | Paraguayan Dev",
  },
  description: DESCRIPTION,
  authors: [{ name: AUTHOR, url: "https://www.linkedin.com/in/cristhian-cano-bogado-orclapex-86473713b/" }],
  creator: AUTHOR,
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    siteName: "Paraguayan Dev",
    locale: "es_PY",
    type: "website",
    title: "Oracle APEX, Oracle Forms y Desarrollo Empresarial | Paraguayan Dev",
    description: DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    creator: "@paraguayandev",
    title: "Oracle APEX, Oracle Forms y Desarrollo Empresarial | Paraguayan Dev",
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

// Inline — no bloquea el render, evita FOUC en dark mode
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');document.documentElement.classList.toggle('dark',t?t==='dark':true);}catch(e){}})();`;

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Paraguayan Dev",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/?search={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Paraguayan Dev",
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.png` },
  sameAs: [
    "https://twitter.com/paraguayandev",
    "https://www.linkedin.com/in/cristhian-cano-bogado-orclapex-86473713b/",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* Inicialización del tema inline — debe ejecutarse antes del primer paint */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-screen flex flex-col">
        {/* Skip link — accesibilidad WCAG 2.4.1 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:px-4 focus:py-2 focus:rounded focus:text-sm focus:font-medium focus:shadow-lg"
          style={{ background: "var(--c-primary)", color: "#fff" }}
        >
          Saltar al contenido principal
        </a>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />

        {children}
      </body>
    </html>
  );
}
