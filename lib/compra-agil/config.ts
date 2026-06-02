import {
	type FilterRuleId,
	parseFilterRules,
} from "./filter";

const PAGE_SIZE_MIN = 15;
const PAGE_SIZE_MAX = 50;

export { formatFilterRulesLabel as formatKeywordsLabel } from "./filter";
export { formatFilterRulesShort as formatKeywordsShort } from "./filter";
export { DEFAULT_FILTER_RULES as DEFAULT_COMPRA_AGIL_KEYWORDS } from "./filter";
export type { FilterRuleId } from "./filter";

export function clampPageSize(size: number): number {
	if (!Number.isFinite(size)) return PAGE_SIZE_MAX;
	return Math.min(PAGE_SIZE_MAX, Math.max(PAGE_SIZE_MIN, Math.floor(size)));
}

export type CompraAgilConfig = {
	ticket: string;
	apiBase: string;
	detailBase: string;
	filterRules: FilterRuleId[];
	pageSize: number;
	/** Pausa entre páginas para no saturar la API (ms). */
	pageDelayMs: number;
	/** Tope opcional de páginas; `null` = recorrer todas según `total_paginas`. */
	maxPagesCap: number | null;
	maxRetries: number;
	estado: string;
};

export function getCompraAgilConfig(): CompraAgilConfig | null {
	const ticket = process.env.MERCADO_PUBLICO_TICKET?.trim();
	if (!ticket) return null;

	const pageSize = Number(process.env.COMPRA_AGIL_PAGE_SIZE ?? String(PAGE_SIZE_MAX));
	const pageDelayMs = Number(process.env.COMPRA_AGIL_PAGE_DELAY_MS ?? "400");
	const maxPagesRaw = process.env.COMPRA_AGIL_MAX_PAGES?.trim();
	const maxRetries = Number(process.env.COMPRA_AGIL_MAX_RETRIES ?? "3");

	let maxPagesCap: number | null = null;
	if (maxPagesRaw && maxPagesRaw !== "0") {
		const cap = Number(maxPagesRaw);
		if (Number.isFinite(cap) && cap > 0) {
			maxPagesCap = Math.floor(cap);
		}
	}

	return {
		ticket,
		apiBase:
			process.env.MERCADO_PUBLICO_API_BASE?.trim() ||
			"https://api2.mercadopublico.cl",
		detailBase:
			process.env.COMPRA_AGIL_DETAIL_BASE?.trim() ||
			"https://www.mercadopublico.cl",
		filterRules: parseFilterRules(process.env.COMPRA_AGIL_KEYWORDS?.trim()),
		pageSize: clampPageSize(pageSize),
		pageDelayMs:
			Number.isFinite(pageDelayMs) && pageDelayMs >= 0 ? pageDelayMs : 400,
		maxPagesCap,
		maxRetries:
			Number.isFinite(maxRetries) && maxRetries >= 0
				? Math.floor(maxRetries)
				: 3,
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
