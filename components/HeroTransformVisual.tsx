"use client";

import { Gear } from "@phosphor-icons/react";
import { useEffect, useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const EASE = [0.23, 1, 0.32, 1] as const;

const STAGES = [
  { id: "legacy", label: "Legado", hint: "Sistemas aislados" },
  { id: "integrate", label: "Integración", hint: "Orquestación" },
  { id: "operate", label: "Operación", hint: "Datos en vivo" },
] as const;

const COLORS = {
  ink: "oklch(0.22 0.03 262)",
  muted: "oklch(0.46 0.025 262)",
  faint: "oklch(0.6 0.02 262)",
  line: "oklch(0.91 0.012 258)",
  lineStrong: "oklch(0.85 0.018 258)",
  surface: "oklch(1 0 0)",
  elevated: "oklch(0.985 0.006 255)",
  panel: "oklch(0.98 0.008 258)",
  primary: "oklch(0.53 0.2 258)",
  primaryStrong: "oklch(0.47 0.2 258)",
  primarySoft: "oklch(0.95 0.03 258)",
  primaryTint: "oklch(0.9 0.05 258)",
  success: "oklch(0.55 0.14 155)",
} as const;

/** Layout tarjeta Operación (evita overflow de KPIs) */
const OPS = { x: 276, w: 108, pad: 12 } as const;
const OPS_INNER_X = OPS.x + OPS.pad;
const OPS_INNER_W = OPS.w - OPS.pad * 2;
const KPI_GAP = 6;
const KPI_Y = 178;
const KPI_H = 38;
const KPI_W = (OPS_INNER_W - KPI_GAP) / 2;

const KPI_ITEMS = [
  { val: "98%", label: "SLA" },
  { val: "24h", label: "24h" },
] as const;

/** Flujo horizontal entre Legado y Operación */
const FLOW_Y = 150;
const FLOW_X1 = 124;
const FLOW_X2 = 276;

function StageTabs({
  active,
  reduce,
}: {
  active: number;
  reduce: boolean;
}) {
  return (
    <div className="mb-2 flex flex-col gap-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
        Pipeline de transformación
      </p>
      <div className="relative flex rounded-full bg-elevated p-1 ring-1 ring-line/80">
        {!reduce && (
          <motion.span
            layoutId="hero-stage-pill"
            className="absolute inset-y-1 rounded-full bg-surface shadow-[0_2px_12px_-4px_rgba(0,55,140,0.25)] ring-1 ring-primary/15"
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            style={{
              left: `calc(${active * (100 / 3)}% + 4px)`,
              width: `calc(${100 / 3}% - 8px)`,
            }}
          />
        )}
        {STAGES.map((stage, i) => (
          <div
            key={stage.id}
            className={`relative z-10 flex flex-1 flex-col items-center rounded-full px-2 py-2 text-center transition-colors duration-300 ${
              i === active
                ? "text-primary"
                : "text-faint"
            } ${reduce && i === active ? "bg-surface ring-1 ring-primary/15" : ""}`}
          >
            <span className="text-[11px] font-medium tracking-tight">
              {stage.label}
            </span>
          </div>
        ))}
      </div>
      <p className="min-h-[1.25rem] text-center font-mono text-[11px] text-muted transition-opacity duration-300">
        {STAGES[active].hint}
      </p>
    </div>
  );
}

export function HeroTransformVisual() {
  const reduce = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setActive((v) => (v + 1) % STAGES.length);
    }, 3800);
    return () => window.clearInterval(id);
  }, [reduce]);

  const glow = (on: boolean) => (on ? 1 : 0.55);

  return (
    <div
      className="relative mx-auto w-full max-w-md lg:max-w-none"
      role="img"
      aria-label="Pipeline de transformación digital: legado, integración y operación conectada"
    >
      <div
        className="pointer-events-none absolute -inset-8 rounded-4xl bg-gradient-to-br from-primary-soft via-primary-tint/40 to-transparent opacity-90 blur-3xl"
        aria-hidden
      />

      <div className="relative overflow-hidden rounded-base bg-surface/90 ring-1 ring-line/90 shadow-[0_32px_64px_-40px_rgba(0,45,120,0.35),0_0_0_1px_rgba(255,255,255,0.6)_inset] backdrop-blur-md">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />

        <div className="relative p-6 sm:p-8">
          <StageTabs active={active} reduce={!!reduce} />

          <div className="relative w-full">
          <svg
            viewBox="0 0 400 300"
            className="h-auto w-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <defs>
              <linearGradient
                id={`${uid}-flow`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor={COLORS.lineStrong} />
                <stop offset="40%" stopColor={COLORS.primary} />
                <stop offset="100%" stopColor={COLORS.primaryStrong} />
              </linearGradient>
              <linearGradient
                id={`${uid}-hub`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor={COLORS.surface} />
                <stop offset="100%" stopColor={COLORS.primarySoft} />
              </linearGradient>
              <linearGradient
                id={`${uid}-panel`}
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor={COLORS.surface} />
                <stop offset="100%" stopColor={COLORS.panel} />
              </linearGradient>
              <filter
                id={`${uid}-shadow`}
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feDropShadow
                  dx="0"
                  dy="6"
                  stdDeviation="8"
                  floodColor="oklch(0.35 0.08 258)"
                  floodOpacity="0.12"
                />
              </filter>
              <filter id={`${uid}-glow`}>
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <radialGradient id={`${uid}-grid-grad`} cx="50%" cy="45%" r="55%">
                <stop offset="0%" stopColor="white" />
                <stop offset="100%" stopColor="black" />
              </radialGradient>
              <mask id={`${uid}-grid-mask`}>
                <rect
                  width="400"
                  height="300"
                  fill={`url(#${uid}-grid-grad)`}
                />
              </mask>
            </defs>

            {/* Grid sutil */}
            <g opacity="0.4" mask={`url(#${uid}-grid-mask)`}>
              {Array.from({ length: 9 }).map((_, row) =>
                Array.from({ length: 13 }).map((__, col) => (
                  <circle
                    key={`${row}-${col}`}
                    cx={32 + col * 26}
                    cy={36 + row * 26}
                    r="0.6"
                    fill={COLORS.line}
                  />
                )),
              )}
            </g>

            {/* —— Legado —— */}
            <g
              filter={`url(#${uid}-shadow)`}
              opacity={glow(active === 0)}
              style={{ transition: "opacity 0.5s ease" }}
            >
              <rect
                x="16"
                y="52"
                width="108"
                height="196"
                rx="14"
                fill={`url(#${uid}-panel)`}
                stroke={active === 0 ? COLORS.primary : COLORS.line}
                strokeWidth={active === 0 ? 2 : 1}
              />
              <text
                x="32"
                y="78"
                fill={COLORS.muted}
                fontSize="10"
                fontFamily="ui-monospace, monospace"
                letterSpacing="0.08em"
              >
                LEGADO
              </text>
              {/* Servidores */}
              {[
                { x: 32, y: 92, h: 44 },
                { x: 52, y: 108, h: 36 },
                { x: 72, y: 100, h: 40 },
              ].map((s, i) => (
                <g key={i}>
                  <rect
                    x={s.x}
                    y={s.y}
                    width="36"
                    height={s.h}
                    rx="6"
                    fill={COLORS.elevated}
                    stroke={COLORS.lineStrong}
                    strokeWidth="1"
                  />
                  <rect
                    x={s.x + 8}
                    y={s.y + 10}
                    width="20"
                    height="3"
                    rx="1"
                    fill={COLORS.line}
                  />
                  <rect
                    x={s.x + 8}
                    y={s.y + 18}
                    width="14"
                    height="3"
                    rx="1"
                    fill={COLORS.line}
                  />
                </g>
              ))}
              {/* Desconexión */}
              <path
                d="M50 148 L70 168 M70 148 L50 168"
                stroke={COLORS.faint}
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.7"
              />
              <rect
                x="32"
                y="188"
                width="76"
                height="44"
                rx="8"
                fill={COLORS.elevated}
                stroke={COLORS.line}
                strokeWidth="1"
              />
              <path
                d="M42 204h24M42 214h16M42 224h20"
                stroke={COLORS.lineStrong}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </g>

            {/* —— Integración (hub) —— */}
            <g
              opacity={glow(active === 1)}
              style={{ transition: "opacity 0.5s ease" }}
            >
              <circle
                cx="200"
                cy="150"
                r="52"
                fill={COLORS.primarySoft}
                opacity="0.5"
              />
              <circle
                cx="200"
                cy="150"
                r="44"
                fill={`url(#${uid}-hub)`}
                stroke={active === 1 ? COLORS.primary : COLORS.lineStrong}
                strokeWidth={active === 1 ? 2.5 : 1.5}
                filter={active === 1 ? `url(#${uid}-glow)` : undefined}
              />
              {!reduce && (
                <motion.g
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 32,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{ transformOrigin: "200px 150px" }}
                >
                  <circle
                    cx="200"
                    cy="150"
                    r="48"
                    stroke={COLORS.primary}
                    strokeWidth="1"
                    strokeDasharray="3 9"
                    strokeOpacity="0.45"
                    fill="none"
                  />
                </motion.g>
              )}
              {/* Nodos orbitales */}
              {[0, 60, 120, 180, 240, 300].map((deg, i) => {
                const rad = (deg * Math.PI) / 180;
                const nx = 200 + Math.cos(rad) * 62;
                const ny = 150 + Math.sin(rad) * 62;
                return (
                  <g key={deg}>
                    <line
                      x1="200"
                      y1="150"
                      x2={nx}
                      y2={ny}
                      stroke={COLORS.primary}
                      strokeWidth="1"
                      strokeOpacity={active === 1 ? 0.35 : 0.15}
                    />
                    <circle
                      cx={nx}
                      cy={ny}
                      r="5"
                      fill={COLORS.surface}
                      stroke={COLORS.primary}
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={nx}
                      cy={ny}
                      r="2"
                      fill={COLORS.primary}
                      opacity={0.5 + (i % 2) * 0.2}
                    />
                  </g>
                );
              })}
              <circle cx="200" cy="150" r="18" fill={COLORS.primary} />              
            </g>

            {/* —— Operación —— */}
            <g
              filter={`url(#${uid}-shadow)`}
              opacity={glow(active === 2)}
              style={{ transition: "opacity 0.5s ease" }}
            >
              <rect
                x="276"
                y="52"
                width="108"
                height="196"
                rx="14"
                fill={`url(#${uid}-panel)`}
                stroke={active === 2 ? COLORS.primary : COLORS.line}
                strokeWidth={active === 2 ? 2 : 1}
              />
              <circle cx={OPS_INNER_X} cy="68" r="3" fill={COLORS.faint} />
              <circle cx={OPS_INNER_X + 12} cy="68" r="3" fill={COLORS.faint} />
              <circle cx={OPS_INNER_X + 24} cy="68" r="3" fill={COLORS.faint} />
              <text
                x={OPS_INNER_X}
                y="90"
                fill={COLORS.muted}
                fontSize="10"
                fontFamily="ui-monospace, monospace"
                letterSpacing="0.08em"
              >
                OPERACIÓN
              </text>
              {/* Sparkline */}
              <rect
                x={OPS_INNER_X}
                y="100"
                width={OPS_INNER_W}
                height="68"
                rx="8"
                fill={COLORS.elevated}
                stroke={COLORS.line}
                strokeWidth="1"
              />
              <motion.path
                d={`M ${OPS_INNER_X + 8} 154 C ${OPS_INNER_X + 24} 144, ${OPS_INNER_X + 40} 148, ${OPS_INNER_X + 52} 134 S ${OPS_INNER_X + 68} 124, ${OPS_INNER_X + OPS_INNER_W - 8} 128`}
                stroke={COLORS.primary}
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: reduce ? 1 : 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: reduce ? 0 : 1.6, delay: 0.4, ease: EASE }}
              />
              <motion.path
                d={`M ${OPS_INNER_X + 8} 154 C ${OPS_INNER_X + 24} 144, ${OPS_INNER_X + 40} 148, ${OPS_INNER_X + 52} 134 S ${OPS_INNER_X + 68} 124, ${OPS_INNER_X + OPS_INNER_W - 8} 128 L ${OPS_INNER_X + OPS_INNER_W - 8} 158 L ${OPS_INNER_X + 8} 158 Z`}
                fill={COLORS.primary}
                fillOpacity="0.08"
                initial={{ opacity: reduce ? 1 : 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: reduce ? 0 : 1, delay: 0.9 }}
              />
              {/* KPIs — SLA y 24h */}
              {KPI_ITEMS.map((kpi, i) => {
                const kx = OPS_INNER_X + i * (KPI_W + KPI_GAP);
                const cx = kx + KPI_W / 2;
                return (
                  <g key={kpi.label}>
                    <rect
                      x={kx}
                      y={KPI_Y}
                      width={KPI_W}
                      height={KPI_H}
                      rx="5"
                      fill={COLORS.surface}
                      stroke={COLORS.line}
                      strokeWidth="1"
                    />
                    <text
                      x={cx}
                      y={KPI_Y + 16}
                      textAnchor="middle"
                      fill={COLORS.ink}
                      fontSize="10"
                      fontWeight="600"
                      fontFamily="ui-sans-serif, system-ui, sans-serif"
                    >
                      {kpi.val}
                    </text>
                    <text
                      x={cx}
                      y={KPI_Y + 27}
                      textAnchor="middle"
                      fill={COLORS.faint}
                      fontSize="7"
                      fontFamily="ui-monospace, monospace"
                    >
                      {kpi.label}
                    </text>
                    <rect
                      x={kx + 4}
                      y={KPI_Y + KPI_H - 6}
                      width={KPI_W - 8}
                      height="2.5"
                      rx="1.25"
                      fill={COLORS.primary}
                      opacity={active === 2 ? 0.85 : 0.35}
                      style={{ transition: "opacity 0.4s ease" }}
                    />
                  </g>
                );
              })}
              <g transform={`translate(${OPS_INNER_X}, 222)`}>
                <circle cx="6" cy="6" r="4" fill={COLORS.success} />
                <text
                  x="16"
                  y="10"
                  fill={COLORS.muted}
                  fontSize="9"
                  fontFamily="ui-monospace, monospace"
                >
                  En línea
                </text>
              </g>
            </g>

            {/* Flujo — flecha horizontal y punto en movimiento */}
            <line
              x1={FLOW_X1}
              y1={FLOW_Y}
              x2={FLOW_X2}
              y2={FLOW_Y}
              stroke={`url(#${uid}-flow)`}
              strokeWidth="2"
              strokeLinecap="round"
              opacity={active >= 1 ? 1 : 0.35}
              style={{ transition: "opacity 0.4s ease" }}
            />
            {!reduce && (
              <motion.circle
                r="4"
                cy={FLOW_Y}
                fill={COLORS.primary}
                initial={{ cx: FLOW_X1 + 4, opacity: 0.9 }}
                animate={{
                  cx: [FLOW_X1 + 15, FLOW_X2 - 15],
                  opacity: [0.85, 1, 0.85],
                }}
                transition={{
                  duration: 4.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
            {reduce && (
              <circle
                cx={(FLOW_X1 + FLOW_X2) / 2}
                cy={FLOW_Y}
                r="4"
                fill={COLORS.primary}
              />
            )}
          </svg>
          <Gear
            size={22}
            weight="bold"
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-surface"
          />
          </div>

          <div className="mt-2 flex items-center justify-between gap-4 border-t border-line/80 pt-5">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                {!reduce && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/50" />
                )}
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
              </span>
              <span className="text-sm font-medium text-ink">
                Sincronización activa
              </span>
            </div>
            <span className="font-mono text-[10px] tabular-nums text-faint">
              Nexso
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
