import {
  Code,
  Compass,
  ArrowsClockwise,
  PlugsConnected,
} from "@phosphor-icons/react/dist/ssr";
import { SectionHeader } from "./SectionHeader";
import { RevealStagger, RevealItem } from "./Reveal";

const SERVICES = [
  {
    icon: Code,
    title: "Desarrollo de software a medida",
    body: "Aplicaciones web y plataformas internas construidas para tu operación real, no para un caso genérico. Acompañamos desde el levantamiento hasta el despliegue.",
    span: "lg:col-span-2",
    feature: true,
  },
  {
    icon: Compass,
    title: "Consultoría TI y transformación digital",
    body: "Definimos la hoja de ruta tecnológica que conecta tus procesos con los objetivos del negocio.",
    span: "",
    feature: false,
  },
  {
    icon: ArrowsClockwise,
    title: "Migración de sistemas legacy",
    body: "Modernizamos plataformas antiguas sin detener la operación, preservando los datos y el conocimiento del negocio.",
    span: "",
    feature: false,
  },
  {
    icon: PlugsConnected,
    title: "APIs y microservicios",
    body: "Diseñamos servicios que conversan entre sí y con terceros, listos para escalar a medida que crece la demanda.",
    span: "lg:col-span-2",
    feature: true,
  },
];

export function Services() {
  return (
    <section
      id="servicios"
      className="mx-auto max-w-page w-full px-5 py-20 sm:px-8 lg:py-28"
    >
      <SectionHeader
        title="Lo que construimos"
        intro="Cuatro frentes de trabajo que cubren el ciclo completo de un producto tecnológico."
      />

      <RevealStagger className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {SERVICES.map((service) => {
          const Icon = service.icon;
          return (
            <RevealItem key={service.title} className={service.span}>
              <article
                className={`flex h-full flex-col rounded-[var(--radius-base)] border border-line p-7 transition-colors duration-300 hover:border-line-strong ${
                  service.feature
                    ? "bg-[radial-gradient(120%_120%_at_85%_0%,var(--color-primary-soft),var(--color-surface)_55%)]"
                    : "bg-surface"
                }`}
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary-strong">
                  <Icon size={22} weight="regular" />
                </span>
                <h3 className="mt-5 text-xl font-semibold tracking-tight text-ink">
                  {service.title}
                </h3>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
                  {service.body}
                </p>
              </article>
            </RevealItem>
          );
        })}
      </RevealStagger>
    </section>
  );
}
