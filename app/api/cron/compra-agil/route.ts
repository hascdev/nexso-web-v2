import { runCompraAgilCron } from "@/lib/compra-agil/run-cron";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;

  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const result = await runCompraAgilCron();
    return Response.json(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error desconocido en el cron.";
    console.error("[cron/compra-agil]", message);
    return Response.json({ error: message }, { status: 500 });
  }
}

/** Permite disparar manualmente con el mismo secreto (p. ej. pruebas locales). */
export async function POST(request: Request) {
  return GET(request);
}
