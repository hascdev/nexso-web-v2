import type { CompraAgilItem } from "./types";
import { buildDetailUrl } from "./client";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatClp(amount: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatRange(desde: Date, hasta: Date): string {
  const fmt = new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Santiago",
  });
  return `${fmt.format(desde)} – ${fmt.format(hasta)}`;
}

function renderItemRow(item: CompraAgilItem, fichaBase: string): string {
  const url = buildDetailUrl(fichaBase, item.codigo);
  return `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid #e5e7eb;vertical-align:top;">
        <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#111827;">
          <a href="${escapeHtml(url)}" style="color:#005ad6;text-decoration:none;">${escapeHtml(item.codigo)}</a>
        </p>
        <p style="margin:0 0 8px;font-size:14px;line-height:1.5;color:#374151;">${escapeHtml(item.nombre)}</p>
        <p style="margin:0;font-size:12px;color:#6b7280;">
          ${escapeHtml(item.institucion.organismo_comprador)} · ${escapeHtml(item.institucion.nombre_region.trim())}
        </p>
      </td>
      <td style="padding:14px 0;border-bottom:1px solid #e5e7eb;vertical-align:top;text-align:right;white-space:nowrap;">
        <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#111827;">${formatClp(item.montos.monto_disponible_clp)}</p>
        <p style="margin:0;font-size:12px;color:#6b7280;">Cierra: ${escapeHtml(item.fechas.fecha_cierre)}</p>
      </td>
    </tr>
  `;
}

export function buildCompraAgilEmailHtml(options: {
  keywordsLabel: string;
  desde: Date;
  hasta: Date;
  items: CompraAgilItem[];
  totalFetched: number;
  pagesFetched: number;
  detailBase: string;
}): string {
  const {
    keywordsLabel,
    desde,
    hasta,
    items,
    totalFetched,
    pagesFetched,
    detailBase,
  } = options;
  const rows =
    items.length > 0
      ? items.map((item) => renderItemRow(item, detailBase)).join("")
      : `<tr><td colspan="2" style="padding:20px 0;color:#6b7280;font-size:14px;">No se encontraron oportunidades que coincidan con ${escapeHtml(keywordsLabel)} en este período.</td></tr>`;

  return `
<!DOCTYPE html>
<html lang="es">
<body style="margin:0;font-family:system-ui,-apple-system,sans-serif;background:#f8fafc;color:#111827;">
  <div style="max-width:640px;margin:24px auto;padding:28px;background:#ffffff;border-radius:0px;border:1px solid #e5e7eb;">
    <p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#005ad6;">Nexso · Compra Ágil</p>
    <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:#111827;">${items.length} ${items.length === 1 ? "oportunidad" : "oportunidades"} encontradas</h1>
    <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#6b7280;">
      Cambios publicados entre ${escapeHtml(formatRange(desde, hasta))}. Se revisaron ${totalFetched} registros (${pagesFetched} página${pagesFetched === 1 ? "" : "s"}).
    </p>
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr>
          <th align="left" style="padding:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#9ca3af;">Oportunidad</th>
          <th align="right" style="padding:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#9ca3af;">Monto / cierre</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="margin:24px 0 0;font-size:12px;color:#9ca3af;">Alerta automática · nexso.cl</p>
  </div>
</body>
</html>`.trim();
}

export function buildCompraAgilEmailText(options: {
  keywordsLabel: string;
  desde: Date;
  hasta: Date;
  items: CompraAgilItem[];
  totalFetched: number;
  pagesFetched: number;
  detailBase: string;
}): string {
  const {
    keywordsLabel,
    desde,
    hasta,
    items,
    totalFetched,
    pagesFetched,
    detailBase,
  } = options;
  const header = [
    "Nexso · Compra Ágil",
    `${items.length} ${items.length === 1 ? "oportunidad" : "oportunidades"} encontradas`,
    `Período: ${formatRange(desde, hasta)}`,
    `Registros revisados: ${totalFetched} (${pagesFetched} página(s))`,
    "",
  ];

  if (items.length === 0) {
    return [...header, `Sin coincidencias para ${keywordsLabel}.`, ""].join("\n");
  }

  const lines = items.map((item, i) => {
    const url = buildDetailUrl(detailBase, item.codigo);
    return [
      `${i + 1}. ${item.codigo} — ${item.nombre}`,
      `   ${item.institucion.organismo_comprador} (${item.institucion.nombre_region.trim()})`,
      `   Monto: ${formatClp(item.montos.monto_disponible_clp)} · Cierra: ${item.fechas.fecha_cierre}`,
      `   ${url}`,
    ].join("\n");
  });

  return [...header, ...lines, ""].join("\n");
}
