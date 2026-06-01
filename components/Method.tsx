import {
  Lightning,
  Sparkle,
  UsersThree,
  CloudCheck,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal, RevealStagger, RevealItem } from "./Reveal";

const POINTS = [
  {
    icon: Lightning,
    title: "Maquetas en menos de 24 horas",
    body: "Ves y validas la propuesta antes de que escribamos la primera línea de producción.",
  },
  {
    icon: Sparkle,
    title: "IA en cada etapa",
    body: "Usamos inteligencia artificial para acortar los tiempos de desarrollo sin resignar calidad.",
  },
  {
    icon: UsersThree,
    title: "Equipo con experiencia",
    body: "Profesionales que ya resolvieron problemas parecidos al tuyo y conocen el terreno.",
  },
  {
    icon: CloudCheck,
    title: "Infraestructura resuelta",
    body: "Nos hacemos cargo del despliegue y la operación para que tu equipo no tenga que hacerlo.",
  },
];

export function Method() {
  return (
    <section id="metodo" className="border-y border-line bg-elevated">
      <div className="mx-auto max-w-page w-full px-5 py-20 sm:px-8 lg:py-28">
        <Reveal>
          <p className="max-w-3xl font-serif text-3xl leading-[1.2] text-ink sm:text-4xl lg:text-[2.9rem]">
            De la idea al objetivo en{" "}
            <span className="italic text-primary">días</span>, no en semanas ni
            meses.
          </p>
        </Reveal>

        <RevealStagger className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-base)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map((point) => {
            const Icon = point.icon;
            return (
              <RevealItem key={point.title} className="bg-elevated">
                <div className="flex h-full flex-col p-7">
                  <Icon
                    size={26}
                    weight="regular"
                    className="text-primary-strong"
                  />
                  <h3 className="mt-5 text-base font-semibold tracking-tight text-ink">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {point.body}
                  </p>
                </div>
              </RevealItem>
            );
          })}
        </RevealStagger>
      </div>
    </section>
  );
}
