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

/** Convierte una fecha/hora civil en `timeZone` al instante UTC (`Date`). */
function localTimeInZoneToUtc(
  parts: ZonedParts,
  timeZone: string,
): Date {
  let utc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );

  for (let i = 0; i < 5; i++) {
    const zoned = getZonedParts(new Date(utc), timeZone);
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

export function formatDateTimeChile(date: Date): string {
  return new Intl.DateTimeFormat("es-CL", {
    timeZone: CHILE_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    hourCycle: "h23",
  }).format(date);
}

export type ChileHourWindow = {
  desde: Date;
  hasta: Date;
  chile: { desde: string; hasta: string };
  utc: { desde: string; hasta: string };
};

/**
 * Ventana de la última hora completa en Chile: [inicio hora anterior, inicio hora actual).
 * Ej. si son las 19:05 en Santiago → 18:00:00 – 19:00:00 (se envía a la API en UTC).
 */
export function getLastCompleteHourWindowChile(
  now = new Date(),
): ChileHourWindow {
  const current = getZonedParts(now, CHILE_TZ);
  const hasta = localTimeInZoneToUtc(
    {
      year: current.year,
      month: current.month,
      day: current.day,
      hour: current.hour,
      minute: 0,
      second: 0,
    },
    CHILE_TZ,
  );
  const desde = new Date(hasta.getTime() - HOUR_MS);

  return {
    desde,
    hasta,
    chile: {
      desde: formatDateTimeChile(desde),
      hasta: formatDateTimeChile(hasta),
    },
    utc: {
      desde: desde.toISOString(),
      hasta: hasta.toISOString(),
    },
  };
}
