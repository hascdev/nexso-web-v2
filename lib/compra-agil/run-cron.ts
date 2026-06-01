import { Resend } from "resend";
import {
  fetchCompraAgilChanges,
  filterByKeyword,
} from "./client";
import {
  getCompraAgilConfig,
  getCompraAgilMailConfig,
} from "./config";
import {
  buildCompraAgilEmailHtml,
  buildCompraAgilEmailText,
} from "./email-template";
import { logCompraAgil } from "./logger";

const HOUR_MS = 60 * 60 * 1000;

export type CronRunResult = {
  ok: true;
  totalFetched: number;
  totalResultados: number;
  matched: number;
  pagesFetched: number;
  emailed: boolean;
  window: { desde: string; hasta: string };
  durationMs: number;
};

export async function runCompraAgilCron(): Promise<CronRunResult> {
  const startedAt = Date.now();
  const apiConfig = getCompraAgilConfig();
  const mailConfig = getCompraAgilMailConfig();

  if (!apiConfig) {
    throw new Error("Falta MERCADO_PUBLICO_TICKET en variables de entorno.");
  }
  if (!mailConfig) {
    throw new Error(
      "Faltan RESEND_API_KEY, COMPRA_AGIL_FROM_EMAIL o COMPRA_AGIL_TO_EMAILS.",
    );
  }

  const hasta = new Date();
  const desde = new Date(hasta.getTime() - HOUR_MS);

  logCompraAgil("run_started", {
    window: { desde: desde.toISOString(), hasta: hasta.toISOString() },
    keyword: apiConfig.keyword,
    estado: apiConfig.estado,
    pageSize: apiConfig.pageSize,
    pageDelayMs: apiConfig.pageDelayMs,
    maxPagesCap: apiConfig.maxPagesCap,
    emailToCount: mailConfig.to.length,
  });

  const fetchStartedAt = Date.now();
  const { items, pagesFetched, totalResultados } =
    await fetchCompraAgilChanges(apiConfig, {
      cambioDesde: desde,
      cambioHasta: hasta,
    });

  logCompraAgil("fetch_completed", {
    pagesFetched,
    totalResultados,
    totalFetched: items.length,
    fetchDurationMs: Date.now() - fetchStartedAt,
  });

  const matched = filterByKeyword(items, apiConfig.keyword);

  logCompraAgil("filter_completed", {
    keyword: apiConfig.keyword,
    matched: matched.length,
    matchedCodigos: matched.map((item) => item.codigo),
  });

  let emailed = false;
  if (matched.length > 0) {
    const resend = new Resend(mailConfig.apiKey);
    const emailPayload = {
      keyword: apiConfig.keyword,
      desde,
      hasta,
      items: matched,
      totalFetched: items.length,
      pagesFetched,
      detailBase: apiConfig.detailBase,
    };

    const { error } = await resend.emails.send({
      from: mailConfig.from,
      to: mailConfig.to,
      subject: `[Nexso] ${matched.length} Compra Ágil con «${apiConfig.keyword}»`,
      html: buildCompraAgilEmailHtml(emailPayload),
      text: buildCompraAgilEmailText(emailPayload),
    });

    if (error) {
      throw new Error(`Resend: ${error.message}`);
    }
    emailed = true;
    logCompraAgil("email_sent", {
      matched: matched.length,
      toCount: mailConfig.to.length,
    });
  } else {
    logCompraAgil("email_skipped", { reason: "no_matches" });
  }

  const result: CronRunResult = {
    ok: true,
    totalFetched: items.length,
    totalResultados,
    matched: matched.length,
    pagesFetched,
    emailed,
    window: {
      desde: desde.toISOString(),
      hasta: hasta.toISOString(),
    },
    durationMs: Date.now() - startedAt,
  };

  logCompraAgil("run_completed", { ...result });

  return result;
}
