import {
  Bank,
  Buildings,
  GraduationCap,
  FirstAid,
  SealCheck,
} from "@phosphor-icons/react/dist/ssr";
import { SectionHeader } from "./SectionHeader";
import { Reveal, RevealStagger, RevealItem } from "./Reveal";

const AUDIENCES = [
  { icon: Bank, name: "Ministerios y servicios públicos" },
  { icon: Buildings, name: "Municipalidades y gobiernos regionales (GORE)" },
  { icon: GraduationCap, name: "Educación: DAEM y corporaciones" },
  { icon: FirstAid, name: "Salud pública" },
];

export function PublicSector() {
  return (
    <section
      id="sector-publico"
      className="border-t border-line bg-elevated"
    >
      <div className="mx-auto max-w-page w-full px-5 py-20 sm:px-8 lg:py-28">
        <SectionHeader
          title="Transformación digital para el Estado chileno"
          intro="Participamos en Compra Ágil y Licitaciones Públicas. Somos proveedores habilitados y conocemos la gestión administrativa por dentro."
        />

        <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_0.82fr] lg:items-start">
          <RevealStagger className="overflow-hidden rounded-[var(--radius-base)] border border-line bg-surface">
            {AUDIENCES.map((item, i) => {
              const Icon = item.icon;
              return (
                <RevealItem key={item.name}>
                  <div
                    className={`flex items-center gap-4 px-6 py-5 ${
                      i !== 0 ? "border-t border-line" : ""
                    }`}
                  >
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary-strong">
                      <Icon size={20} weight="regular" />
                    </span>
                    <span className="text-[15px] font-medium text-ink">
                      {item.name}
                    </span>
                  </div>
                </RevealItem>
              );
            })}
          </RevealStagger>

          <Reveal delay={0.1} y={24}>
            <aside className="flex h-full flex-col rounded-[var(--radius-base)] border border-primary-tint bg-primary-soft p-8">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-on-primary">
                <SealCheck size={22} weight="fill" />
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-ink">
                Cómo contratarnos desde el Estado
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                Información oficial para Mercado Público. Nuestra razón social
                registrada es:
              </p>
              <p className="mt-4 rounded-xl border border-primary-tint bg-surface px-4 py-3 font-mono text-base font-medium text-ink">
                Nexso SpA
              </p>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
