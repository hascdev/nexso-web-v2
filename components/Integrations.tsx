import {
  Receipt,
  WhatsappLogo,
  TelegramLogo,
  SlackLogo,
} from "@phosphor-icons/react/dist/ssr";
import { SectionHeader } from "./SectionHeader";
import { IntegrationLogos } from "./IntegrationLogos";
import { Reveal, RevealStagger, RevealItem } from "./Reveal";

const SII_ITEMS = [
  "Generar boletas de honorarios",
  "Descargar DTEs",
  "Información del contribuyente",
  "Datos de empresas",
];

const AGENTS = [
  { icon: WhatsappLogo, name: "WhatsApp" },
  { icon: TelegramLogo, name: "Telegram" },
  { icon: SlackLogo, name: "Slack" },
];

export function Integrations() {
  return (
    <section
      id="integraciones"
      className="mx-auto max-w-page w-full px-5 py-20 sm:px-8 lg:py-28"
    >
      <SectionHeader
        title="Conectamos con los sistemas que ya usas"
        intro="Integramos ERPs, CRMs, plataformas de RRHH y marketplaces para que la información fluya sin trabajo manual."
      />

      <Reveal delay={0.1}>
        <div className="my-12">
          <IntegrationLogos />
        </div>
      </Reveal>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal delay={0.05}>
          <div className="flex h-full flex-col rounded-[var(--radius-base)] border border-line bg-surface p-8">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary-strong">
              <Receipt size={22} weight="regular" />
            </span>
            <h3 className="mt-5 text-xl font-semibold tracking-tight text-ink">
              Información directa desde el SII
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              Automatizamos trámites tributarios que hoy hacen a mano.
            </p>
            <ul className="mt-6 divide-y divide-line border-t border-line">
              {SII_ITEMS.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 py-3 font-mono text-sm text-ink"
                >
                  <span className="text-primary">/</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="flex h-full flex-col rounded-[var(--radius-base)] border border-line bg-[radial-gradient(120%_120%_at_15%_0%,var(--color-primary-soft),var(--color-surface)_55%)] p-8">
            <h3 className="text-xl font-semibold tracking-tight text-ink">
              Agentes de IA donde tu equipo conversa
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              Creamos asistentes que atienden y resuelven dentro de los canales
              que ya ocupas.
            </p>
            <RevealStagger className="mt-6 flex flex-col gap-3">
              {AGENTS.map((agent) => {
                const Icon = agent.icon;
                return (
                  <RevealItem key={agent.name}>
                    <div className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3">
                      <Icon
                        size={22}
                        weight="regular"
                        className="text-primary-strong"
                      />
                      <span className="text-[15px] font-medium text-ink">
                        {agent.name}
                      </span>
                    </div>
                  </RevealItem>
                );
              })}
            </RevealStagger>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
