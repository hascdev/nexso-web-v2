import { FAQ_ITEMS } from "@/lib/seo/schema";
import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";

export function SeoFaq() {
  return (
    <section
      id="preguntas-frecuentes"
      className="mx-auto max-w-page w-full px-5 py-20 sm:px-8 lg:py-28"
    >
      <SectionHeader
        title="Preguntas frecuentes"
        intro="Respuestas directas sobre Nexso y cómo trabajamos en Chile."
      />
      <dl className="mt-10 divide-y divide-line rounded-[var(--radius-base)] border border-line bg-surface">
        {FAQ_ITEMS.map((item, i) => (
          <Reveal key={item.question} delay={0.04 * i}>
            <div className="px-6 py-5 sm:px-8">
              <dt className="text-base font-semibold tracking-tight text-ink">
                {item.question}
              </dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-muted">
                {item.answer}
              </dd>
            </div>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
