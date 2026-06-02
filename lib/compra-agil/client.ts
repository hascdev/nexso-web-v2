import type {
	CompraAgilApiResponse,
	CompraAgilItem,
	CompraAgilPaginacion,
} from "./types";
import type { CompraAgilConfig } from "./config";
import { logCompraAgil } from "./logger";
import { retryDelayMs, sleep } from "./rate-limit";

export type FetchCompraAgilParams = {
	/** ISO con hora civil Chile y sufijo Z (ej. `2026-06-02T16:00:00Z`). */
	cambioDesde: string;
	cambioHasta: string;
};

export type FetchCompraAgilResult = {
	items: CompraAgilItem[];
	paginacion: CompraAgilPaginacion | null;
	pagesFetched: number;
	totalResultados: number;
};

function buildListUrl(
	config: CompraAgilConfig,
	params: FetchCompraAgilParams,
	page: number,
): string {
	const url = new URL("/v2/compra-agil", config.apiBase);
	url.searchParams.set("cambio_desde", params.cambioDesde);
	url.searchParams.set("cambio_hasta", params.cambioHasta);
	url.searchParams.set("estado", config.estado);
	url.searchParams.set("tamano_pagina", String(config.pageSize));
	url.searchParams.set("numero_pagina", String(page));
	return url.toString();
}

export function buildDetailUrl(
	detailBase: string,
	detallePath: string,
): string {
	const base = detailBase.replace(/\/$/, "");
	const path = detallePath.startsWith("/") ? detallePath : `/${detallePath}`;
	return `${base}${path}`;
}

async function fetchCompraAgilPage(
	config: CompraAgilConfig,
	url: string,
): Promise<CompraAgilApiResponse> {
	for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
		const res = await fetch(url, {
			headers: {
				ticket: config.ticket,
				Accept: "application/json",
			},
			cache: "no-store",
		});

		if (res.status === 429) {
			if (attempt >= config.maxRetries) {
				throw new Error(
					"Compra Ágil API: rate limit (429) tras reintentos. Aumenta COMPRA_AGIL_PAGE_DELAY_MS.",
				);
			}
			const waitMs = retryDelayMs(attempt, res.headers.get("Retry-After"));
			logCompraAgil("api_rate_limited", { attempt, waitMs, url });
			await sleep(waitMs);
			continue;
		}

		if (!res.ok) {
			throw new Error(
				`Compra Ágil API respondió ${res.status} ${res.statusText}`,
			);
		}

		const data = (await res.json()) as CompraAgilApiResponse;

		if (data.success !== "OK" || !data.payload) {
			throw new Error("Compra Ágil API devolvió una respuesta inválida.");
		}

		return data;
	}

	throw new Error("Compra Ágil API: no se pudo obtener la página.");
}

/**
 * Recorre todas las páginas reportadas en `paginacion.total_paginas`
 * (o hasta `maxPagesCap` si está configurado).
 */
export async function fetchCompraAgilChanges(
	config: CompraAgilConfig,
	params: FetchCompraAgilParams,
): Promise<FetchCompraAgilResult> {
	const allItems: CompraAgilItem[] = [];
	let lastPagination: CompraAgilPaginacion | null = null;
	let page = 1;
	let totalPages = 1;

	while (page <= totalPages) {
		if (config.maxPagesCap !== null && page > config.maxPagesCap) {
			logCompraAgil("pagination_capped", {
				maxPagesCap: config.maxPagesCap,
				totalPages,
			});
			break;
		}

		const data = await fetchCompraAgilPage(
			config,
			buildListUrl(config, params, page),
		);

		const pageItems = data.payload!.items;
		allItems.push(...pageItems);
		lastPagination = data.payload!.paginacion;
		totalPages = lastPagination.total_paginas;

		logCompraAgil("page_fetched", {
			page,
			totalPages,
			itemsInPage: pageItems.length,
			accumulated: allItems.length,
			totalResultados: lastPagination.total_resultados,
			cambioDesde: params.cambioDesde,
			cambioHasta: params.cambioHasta,
		});

		if (page >= totalPages) {
			break;
		}

		page += 1;
		if (config.pageDelayMs > 0) {
			await sleep(config.pageDelayMs);
		}
	}

	return {
		items: allItems,
		paginacion: lastPagination,
		pagesFetched: page,
		totalResultados: lastPagination?.total_resultados ?? allItems.length,
	};
}

/** Coincide si el nombre contiene al menos una palabra clave (ignore case). */
export function filterByKeywords(
	items: CompraAgilItem[],
	keywords: string[],
): CompraAgilItem[] {
	const needles = keywords
		.map((k) => k.trim().toLowerCase())
		.filter(Boolean);
	if (needles.length === 0) return items;

	return items.filter((item) => {
		const nombre = item.nombre.toLowerCase();
		return needles.some((needle) => nombre.includes(needle));
	});
}
