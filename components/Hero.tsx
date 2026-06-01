import { ArrowRight, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";
import { HeroTransformVisual } from "./HeroTransformVisual";

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-dvh overflow-hidden border-b border-line"
    >
      {/* Atmósfera */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-32 right-[-10%] h-[min(70vw,520px)] w-[min(70vw,520px)] rounded-full bg-primary-soft opacity-90 blur-3xl" />
        <div className="absolute bottom-[-12%] left-[-5%] h-72 w-96 rounded-full bg-primary-tint/80 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `
              linear-gradient(to right, oklch(0.91 0.012 258 / 0.5) 1px, transparent 1px),
              linear-gradient(to bottom, oklch(0.91 0.012 258 / 0.5) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse 80% 70% at 50% 40%, black 20%, transparent 75%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto grid min-h-dvh max-w-page w-full grid-cols-1 items-center gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
        <div className="max-w-xl">
          <Reveal playOnMount>
            <p className="mb-10 inline-flex items-center gap-2 rounded-full border border-primary-tint/80 bg-primary-soft/60 px-3 py-1 font-mono text-xs tracking-tight text-primary">
              <Sparkle size={14} weight="fill" aria-hidden />
              Transformación digital · Chile
            </p>
          </Reveal>
          <Reveal playOnMount delay={0.05}>
            <h1 className="text-balance text-4xl font-semibold leading-[1.06] tracking-tight text-ink sm:text-[2.75rem] lg:text-5xl">
              Alineamos tu tecnología con los{" "}
              <span className="font-serif text-[1.05em] text-primary">
                objetivos
              </span>{" "}
              de tu negocio
            </h1>
          </Reveal>
          <Reveal playOnMount delay={0.12}>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-muted">
              De sistemas aislados a operación conectada: software a medida,
              consultoría TI e integraciones para el sector público y privado.
            </p>
          </Reveal>
          <Reveal playOnMount delay={0.18}>
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-faint">
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-primary" aria-hidden />
                Maquetas en &lt;24 h
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-primary" aria-hidden />
                Integraciones nativas
              </li>
            </ul>
          </Reveal>
          <Reveal playOnMount delay={0.22}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#contacto"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-medium text-on-primary transition-[transform,background-color] duration-200 ease-[var(--ease-out-strong)] hover:bg-primary-strong active:scale-[0.97]"
              >
                Conversemos
                <ArrowRight size={18} weight="bold" />
              </a>
              <a
                href="#servicios"
                className="inline-flex items-center justify-center rounded-full border border-line-strong bg-surface/80 px-6 py-3 text-base font-medium text-ink backdrop-blur-sm transition-[transform,border-color] duration-200 ease-[var(--ease-out-strong)] hover:border-primary/40 active:scale-[0.97]"
              >
                Ver servicios
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal playOnMount delay={0.1} y={24} className="w-full min-w-0 lg:justify-self-end">
          <HeroTransformVisual />
        </Reveal>
      </div>
    </section>
  );
}
