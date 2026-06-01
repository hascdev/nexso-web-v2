import type {
  CompraAgilApiResponse,
  CompraAgilItem,
  CompraAgilPaginacion,
} from "./types";
import type { CompraAgilConfig } from "./config";

export type FetchCompraAgilParams = {
  cambioDesde: Date;
  cambioHasta: Date;
  /** Si no se indica, usa config.maxPages */
  maxPages?: number;
};

export type FetchCompraAgilResult = {
  items: CompraAgilItem[];
  paginacion: CompraAgilPaginacion | null;
  pagesFetched: number;
};

function toApiIso(date: Date): string {
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
}

export function buildDetailUrl(
  detailBase: string,
  detallePath: string,
): string {
  const base = detailBase.replace(/\/$/, "");
  const path = detallePath.startsWith("/") ? detallePath : `/${detallePath}`;
  return `${base}${path}`;
}

export async function fetchCompraAgilChanges(
  config: CompraAgilConfig,
  params: FetchCompraAgilParams,
): Promise<FetchCompraAgilResult> {
  const maxPages = params.maxPages ?? config.maxPages;
  const allItems: CompraAgilItem[] = [];
  let lastPagination: CompraAgilPaginacion | null = null;
  let page = 1;

  while (page <= maxPages) {
    const url = new URL("/v2/compra-agil", config.apiBase);
    url.searchParams.set("cambio_desde", toApiIso(params.cambioDesde));
    url.searchParams.set("cambio_hasta", toApiIso(params.cambioHasta));
    url.searchParams.set("estado", config.estado);
    url.searchParams.set("tamano_pagina", String(config.pageSize));
    url.searchParams.set("numero_pagina", String(page));

    const res = await fetch(url.toString(), {
      headers: {
        ticket: config.ticket,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(
        `Compra Ágil API respondió ${res.status} ${res.statusText}`,
      );
    }

    const data = (await res.json()) as CompraAgilApiResponse;

    if (data.success !== "OK" || !data.payload) {
      throw new Error("Compra Ágil API devolvió una respuesta inválida.");
    }

    allItems.push(...data.payload.items);
    lastPagination = data.payload.paginacion;

    const totalPages = data.payload.paginacion.total_paginas;
    if (page >= totalPages || page >= maxPages) {
      break;
    }

    page += 1;
  }

  return {
    items: allItems,
    paginacion: lastPagination,
    pagesFetched: page,
  };
}

export function filterByKeyword(
  items: CompraAgilItem[],
  keyword: string,
): CompraAgilItem[] {
  const needle = keyword.trim().toLowerCase();
  if (!needle) return items;

  return items.filter((item) => item.nombre.toLowerCase().includes(needle));
}
