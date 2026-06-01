import { runCompraAgilCron } from "@/lib/compra-agil/run-cron";
import { logCompraAgil, logCompraAgilError } from "@/lib/compra-agil/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** Varias páginas + pausas; en Pro puedes subirlo en el dashboard si hace falta. */
export const maxDuration = 60;

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;

  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    logCompraAgilError("request_unauthorized");
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  logCompraAgil("request_received", {
    method: request.method,
    userAgent: request.headers.get("user-agent"),
    vercelCron: request.headers.get("x-vercel-cron"),
    cronSchedule: request.headers.get("x-vercel-cron-schedule"),
  });

  try {
    const result = await runCompraAgilCron();
    return Response.json(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error desconocido en el cron.";
    logCompraAgilError("run_failed", { message });
    return Response.json({ error: message }, { status: 500 });
  }
}

/** Permite disparar manualmente con el mismo secreto (p. ej. pruebas locales). */
export async function POST(request: Request) {
  return GET(request);
}
