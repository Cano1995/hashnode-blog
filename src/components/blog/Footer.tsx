import Link from "next/link";
import { PenSquare } from "lucide-react";

interface FooterProps {
  siteName?: string;
  twitterUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export function Footer({ siteName = "Mi Blog", twitterUrl, githubUrl, linkedinUrl }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <PenSquare className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-semibold">{siteName}</span>
          </div>

          <nav className="flex gap-6 text-sm">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <Link href="/tags" className="hover:text-white transition-colors">Etiquetas</Link>
          </nav>

          <div className="flex items-center gap-4 text-sm">
            {twitterUrl && (
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Twitter
              </a>
            )}
            {githubUrl && (
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                GitHub
              </a>
            )}
            {linkedinUrl && (
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                LinkedIn
              </a>
            )}
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          <p>© {new Date().getFullYear()} {siteName}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
