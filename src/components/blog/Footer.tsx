import Link from "next/link";
import Image from "next/image";

interface FooterProps {
  siteName?: string;
  twitterUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export function Footer({ siteName = "Blog", twitterUrl, githubUrl, linkedinUrl }: FooterProps) {
  const socials = [
    twitterUrl && { label: "Twitter", href: twitterUrl },
    githubUrl && { label: "GitHub", href: githubUrl },
    linkedinUrl && { label: "LinkedIn", href: linkedinUrl },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer style={{ background: "var(--c-surface)", borderTop: "1px solid var(--c-border)" }}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/icon.png" alt={siteName} width={24} height={24} className="rounded-md opacity-80 dark:invert" />
            <span className="text-sm font-medium" style={{ color: "var(--c-muted)" }}>{siteName}</span>
          </Link>

          <div className="flex flex-wrap items-center gap-6 text-sm" style={{ color: "var(--c-muted)" }}>
            <Link href="/" className="hover:underline transition-colors" style={{ color: "var(--c-muted)" }}>Artículos</Link>
            <Link href="/tags" className="hover:underline transition-colors" style={{ color: "var(--c-muted)" }}>Etiquetas</Link>
            {socials.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline transition-colors"
                style={{ color: "var(--c-muted)" }}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-6 text-xs" style={{ borderTop: "1px solid var(--c-border)", color: "var(--c-subtle)" }}>
          © {new Date().getFullYear()} {siteName}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
