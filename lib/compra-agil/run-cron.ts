import { Resend } from "resend";
import { fetchCompraAgilChanges } from "./client";
import {
	formatKeywordsLabel,
	formatKeywordsShort,
	getCompraAgilConfig,
	getCompraAgilMailConfig,
} from "./config";
import {
	buildCompraAgilEmailHtml,
	buildCompraAgilEmailText,
} from "./email-template";
import {
	filterCompraAgilItems,
	getMatchReasons,
} from "./filter";
import { logCompraAgil } from "./logger";
import { getLastCompleteHourWindowChile } from "./timezone";

export type CronWindow = {
	/** Valores enviados a `cambio_desde` / `cambio_hasta` (hora civil Chile + Z). */
	desde: string;
	hasta: string;
	desdeChile: string;
	hastaChile: string;
	timezone: string;
};

export type CronRunResult = {
	ok: true;
	totalFetched: number;
	totalResultados: number;
	matched: number;
	pagesFetched: number;
	emailed: boolean;
	window: CronWindow;
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

	const hourWindow = getLastCompleteHourWindowChile();
	const window: CronWindow = {
		desde: hourWindow.api.desde,
		hasta: hourWindow.api.hasta,
		desdeChile: hourWindow.chile.desde,
		hastaChile: hourWindow.chile.hasta,
		timezone: "America/Santiago",
	};

	logCompraAgil("run_started", {
		window,
		filterRules: apiConfig.filterRules,
		estado: apiConfig.estado,
		pageSize: apiConfig.pageSize,
		pageDelayMs: apiConfig.pageDelayMs,
		maxPagesCap: apiConfig.maxPagesCap,
		emailToCount: mailConfig.to.length,
	});

	const fetchStartedAt = Date.now();
	const { items, pagesFetched, totalResultados } =
		await fetchCompraAgilChanges(apiConfig, {
			cambioDesde: hourWindow.api.desde,
			cambioHasta: hourWindow.api.hasta,
		});

	logCompraAgil("fetch_completed", {
		pagesFetched,
		totalResultados,
		totalFetched: items.length,
		fetchDurationMs: Date.now() - fetchStartedAt,
		window,
	});

	const matched = filterCompraAgilItems(items, apiConfig.filterRules);

	logCompraAgil("filter_completed", {
		filterRules: apiConfig.filterRules,
		matched: matched.length,
		matchedItems: matched.map((item) => ({
			codigo: item.codigo,
			reasons: getMatchReasons(item.nombre, apiConfig.filterRules),
		})),
	});

	let emailed = false;
	if (matched.length > 0) {
		const resend = new Resend(mailConfig.apiKey);
		const rulesLabel = formatKeywordsLabel(apiConfig.filterRules);
		const emailPayload = {
			keywordsLabel: rulesLabel,
			desde: hourWindow.desde,
			hasta: hourWindow.hasta,
			items: matched,
			totalFetched: items.length,
			pagesFetched,
			detailBase: apiConfig.detailBase,
		};

		const { error } = await resend.emails.send({
			from: mailConfig.from,
			to: mailConfig.to,
			subject: `[Nexso] ${matched.length} Compra Ágil (${formatKeywordsShort(apiConfig.filterRules)})`,
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
		window,
		durationMs: Date.now() - startedAt,
	};

	logCompraAgil("run_completed", { ...result });

	return result;
}
