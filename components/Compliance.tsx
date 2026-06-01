import {
  Scales,
  ShieldCheck,
  Robot,
  ArrowsClockwise,
} from "@phosphor-icons/react/dist/ssr";
import { SectionHeader } from "./SectionHeader";
import { RevealStagger, RevealItem } from "./Reveal";

const ITEMS = [
  {
    icon: Scales,
    title: "Ley de Compras Públicas",
    body: "Operamos dentro del marco de la Ley 19.886 y sus procesos en Mercado Público.",
  },
  {
    icon: ShieldCheck,
    title: "Protección de datos personales",
    body: "Tratamos la información según la normativa vigente de protección de datos en Chile.",
  },
  {
    icon: Robot,
    title: "Ley de Inteligencia Artificial",
    body: "Construimos con criterios de uso responsable de IA y atentos a la regulación en desarrollo.",
  },
  {
    icon: ArrowsClockwise,
    title: "Transformación digital del Estado",
    body: "Alineados con la Ley 21.180 de Transformación Digital y sus estándares.",
  },
];

export function Compliance() {
  return (
    <section
      id="cumplimiento"
      className="border-t border-line bg-elevated"
    >
      <div className="mx-auto max-w-page w-full px-5 py-20 sm:px-8 lg:py-28">
        <SectionHeader
          title="Cumplimiento y normativa"
          intro="Trabajamos dentro de las reglas que rigen al sector público y al tratamiento de datos en Chile."
        />

        <RevealStagger className="mt-12 grid grid-cols-1 gap-x-12 gap-y-px sm:grid-cols-2">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <RevealItem key={item.title}>
                <div className="flex gap-4 border-t border-line py-7">
                  <Icon
                    size={24}
                    weight="regular"
                    className="mt-0.5 shrink-0 text-primary-strong"
                  />
                  <div>
                    <h3 className="text-base font-semibold tracking-tight text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {item.body}
                    </p>
                  </div>
                </div>
              </RevealItem>
            );
          })}
        </RevealStagger>
      </div>
    </section>
  );
}
