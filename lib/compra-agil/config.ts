export type CompraAgilConfig = {
  ticket: string;
  apiBase: string;
  detailBase: string;
  keyword: string;
  pageSize: number;
  maxPages: number;
  estado: string;
};

export function getCompraAgilConfig(): CompraAgilConfig | null {
  const ticket = process.env.MERCADO_PUBLICO_TICKET?.trim();
  if (!ticket) return null;

  const pageSize = Number(process.env.COMPRA_AGIL_PAGE_SIZE ?? "50");
  const maxPages = Number(process.env.COMPRA_AGIL_MAX_PAGES ?? "1");

  return {
    ticket,
    apiBase:
      process.env.MERCADO_PUBLICO_API_BASE?.trim() ||
      "https://api2.mercadopublico.cl",
    detailBase:
      process.env.COMPRA_AGIL_DETAIL_BASE?.trim() ||
      "https://www.mercadopublico.cl",
    keyword: process.env.COMPRA_AGIL_KEYWORD?.trim() || "Software",
    pageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 50,
    maxPages: Number.isFinite(maxPages) && maxPages > 0 ? maxPages : 1,
    estado: process.env.COMPRA_AGIL_ESTADO?.trim() || "publicada",
  };
}

export type CompraAgilMailConfig = {
  apiKey: string;
  from: string;
  to: string[];
};

export function getCompraAgilMailConfig(): CompraAgilMailConfig | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from =
    process.env.COMPRA_AGIL_FROM_EMAIL?.trim() ||
    process.env.CONTACT_FROM_EMAIL?.trim();
  const toRaw =
    process.env.COMPRA_AGIL_TO_EMAILS?.trim() ||
    process.env.CONTACT_TO_EMAILS?.trim();

  if (!apiKey || !from || !toRaw) return null;

  const to = toRaw
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  if (to.length === 0) return null;

  return { apiKey, from, to };
}
