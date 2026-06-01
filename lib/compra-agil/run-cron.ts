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

const HOUR_MS = 60 * 60 * 1000;

export type CronRunResult = {
  ok: true;
  totalFetched: number;
  matched: number;
  pagesFetched: number;
  emailed: boolean;
  window: { desde: string; hasta: string };
};

export async function runCompraAgilCron(): Promise<CronRunResult> {
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

  const { items, pagesFetched } = await fetchCompraAgilChanges(apiConfig, {
    cambioDesde: desde,
    cambioHasta: hasta,
  });

  const matched = filterByKeyword(items, apiConfig.keyword);

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
  }

  return {
    ok: true,
    totalFetched: items.length,
    matched: matched.length,
    pagesFetched,
    emailed,
    window: {
      desde: desde.toISOString(),
      hasta: hasta.toISOString(),
    },
  };
}
