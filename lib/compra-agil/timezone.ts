export const CHILE_TZ = "America/Santiago";

const HOUR_MS = 60 * 60 * 1000;

type ZonedParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function getZonedParts(date: Date, timeZone: string): ZonedParts {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(date).map((p) => [p.type, p.value]),
  );
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
  };
}

/** Convierte hora civil Chile → instante UTC (solo para emails / display). */
function chilePartsToUtc(parts: ZonedParts): Date {
  let utc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );

  for (let i = 0; i < 5; i++) {
    const zoned = getZonedParts(new Date(utc), CHILE_TZ);
    const targetMs = Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second,
    );
    const actualMs = Date.UTC(
      zoned.year,
      zoned.month - 1,
      zoned.day,
      zoned.hour,
      zoned.minute,
      zoned.second,
    );
    const diff = targetMs - actualMs;
    if (diff === 0) break;
    utc += diff;
  }

  return new Date(utc);
}

/**
 * Formato que espera la API de Mercado Público: componentes de hora Chile con sufijo Z
 * (no es UTC real; ej. 16:00 Chile → `2026-06-02T16:00:00Z`).
 */
export function formatApiDateTime(parts: ZonedParts): string {
  return `${parts.year}-${pad2(parts.month)}-${pad2(parts.day)}T${pad2(parts.hour)}:${pad2(parts.minute)}:${pad2(parts.second)}Z`;
}

export function formatDateTimeChile(parts: ZonedParts): string {
  return `${pad2(parts.day)}-${pad2(parts.month)}-${parts.year}, ${pad2(parts.hour)}:${pad2(parts.minute)}:${pad2(parts.second)}`;
}

export type ChileHourWindow = {
  /** Parámetros `cambio_desde` / `cambio_hasta` para la API. */
  api: { desde: string; hasta: string };
  chile: { desde: string; hasta: string };
  /** Instantes UTC equivalentes (solo para plantillas de correo). */
  desde: Date;
  hasta: Date;
};

/**
 * Última hora completa en Chile: [hora anterior, hora actual) en hora civil.
 * Ej. cron a las 17:05 CLT → API: T16:00:00Z – T17:00:00Z.
 */
export function getLastCompleteHourWindowChile(
  now = new Date(),
): ChileHourWindow {
  const current = getZonedParts(now, CHILE_TZ);
  const hastaParts: ZonedParts = {
    year: current.year,
    month: current.month,
    day: current.day,
    hour: current.hour,
    minute: 0,
    second: 0,
  };

  const hastaUtc = chilePartsToUtc(hastaParts);
  const desdeZoned = getZonedParts(
    new Date(hastaUtc.getTime() - HOUR_MS),
    CHILE_TZ,
  );
  const desdeParts: ZonedParts = {
    year: desdeZoned.year,
    month: desdeZoned.month,
    day: desdeZoned.day,
    hour: desdeZoned.hour,
    minute: 0,
    second: 0,
  };

  return {
    api: {
      desde: formatApiDateTime(desdeParts),
      hasta: formatApiDateTime(hastaParts),
    },
    chile: {
      desde: formatDateTimeChile(desdeParts),
      hasta: formatDateTimeChile(hastaParts),
    },
    desde: chilePartsToUtc(desdeParts),
    hasta: chilePartsToUtc(hastaParts),
  };
}
