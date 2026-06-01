import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function SectionHeader({
  title,
  intro,
  align = "left",
  className = "",
}: {
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={`flex max-w-2xl flex-col gap-4 ${
        align === "center" ? "mx-auto text-center" : ""
      } ${className}`}
    >
      <Reveal>
        <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
          {title}
        </h2>
      </Reveal>
      {intro ? (
        <Reveal delay={0.06}>
          <p className="text-lg leading-relaxed text-muted">{intro}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
