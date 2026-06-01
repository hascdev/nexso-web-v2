import {
  ChartLineUp,
  Storefront,
  RocketLaunch,
  ArrowUpRight,
} from "@phosphor-icons/react/dist/ssr";
import { SectionHeader } from "./SectionHeader";
import { RevealStagger, RevealItem } from "./Reveal";

const SECTORS = [
  {
    icon: ChartLineUp,
    name: "Financieras y fintech",
    body: "Plataformas que manejan datos sensibles, conciliaciones y volumen sin caerse.",
  },
  {
    icon: Storefront,
    name: "Retail y comercio",
    body: "Integración de inventario, ventas y marketplaces en un solo flujo de datos.",
  },
  {
    icon: RocketLaunch,
    name: "Startups",
    body: "Del MVP a la versión que escala, con un equipo que se mueve a tu ritmo.",
  },
];

export function PrivateSector() {
  return (
    <section
      id="sector-privado"
      className="mx-auto max-w-page w-full px-5 py-20 sm:px-8 lg:py-28"
    >
      <SectionHeader
        title="Desarrollo de alto nivel para empresas que escalan"
        intro="Modernizamos infraestructura, integramos plataformas y construimos soluciones a medida para compañías privadas."
      />

      <RevealStagger className="mt-12 overflow-hidden rounded-[var(--radius-base)] border border-line">
        {SECTORS.map((sector, i) => {
          const Icon = sector.icon;
          return (
            <RevealItem key={sector.name}>
              <article
                className={`group flex flex-col gap-4 bg-surface px-6 py-8 transition-colors duration-300 hover:bg-elevated sm:flex-row sm:items-center sm:gap-8 sm:px-8 ${
                  i !== 0 ? "border-t border-line" : ""
                }`}
              >
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-strong">
                  <Icon size={24} weight="regular" />
                </span>
                <h3 className="text-xl font-semibold tracking-tight text-ink sm:w-64 sm:shrink-0">
                  {sector.name}
                </h3>
                <p className="max-w-md text-[15px] leading-relaxed text-muted">
                  {sector.body}
                </p>
                <ArrowUpRight
                  size={22}
                  weight="bold"
                  className="hidden shrink-0 text-faint transition-[color,transform] duration-300 ease-[var(--ease-out-strong)] group-hover:-translate-y-0.5 group-hover:text-primary sm:ml-auto sm:block"
                />
              </article>
            </RevealItem>
          );
        })}
      </RevealStagger>
    </section>
  );
}
