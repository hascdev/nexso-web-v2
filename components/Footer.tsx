import { WHATSAPP_URL } from "@/lib/whatsapp";
import { Wordmark } from "./Wordmark";

const NAV = [
  { href: "#servicios", label: "Servicios" },
  { href: "#metodo", label: "Método" },
  { href: "#integraciones", label: "Integraciones" },
  { href: "#sector-publico", label: "Sector público" },
  { href: "#sector-privado", label: "Sector privado" },
  { href: "#cumplimiento", label: "Cumplimiento" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-page w-full px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xs">
            <Wordmark />
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Soluciones tecnológicas y transformación digital para el sector
              público y privado en Chile.
            </p>
            <p className="mt-4 font-mono text-xs text-faint">Nexso SpA</p>
          </div>

          <nav className="grid grid-cols-2 gap-x-12 gap-y-3 sm:grid-cols-3">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-muted transition-colors duration-200 hover:text-ink"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-on-primary transition-transform duration-200 ease-[var(--ease-out-strong)] active:scale-[0.97]"
            >
              Conversemos
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-line pt-6">
          <p className="text-xs text-faint">
            © {new Date().getFullYear()} Nexso SpA. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
