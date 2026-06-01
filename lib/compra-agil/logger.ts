const SCOPE = "compra-agil/cron";

export function logCompraAgil(
  event: string,
  data?: Record<string, unknown>,
): void {
  console.log(
    JSON.stringify({
      scope: SCOPE,
      event,
      ts: new Date().toISOString(),
      ...data,
    }),
  );
}

export function logCompraAgilError(
  event: string,
  data?: Record<string, unknown>,
): void {
  console.error(
    JSON.stringify({
      scope: SCOPE,
      event,
      level: "error",
      ts: new Date().toISOString(),
      ...data,
    }),
  );
}
