import { fetchCompraAgilFiltered } from "./client";
import { formatKeywordsLabel, getCompraAgilConfig, getCompraAgilMailConfig } from "./config";
import {
	buildCompraAgilEmailHtml,
	buildCompraAgilEmailText,
} from "./email-template";
import { getMatchReasons } from "./filter";
import { logCompraAgil } from "./logger";
import { getLastCompleteHourWindowChile } from "./timezone";
import { Resend } from "resend";

const LOG_MATCHED_SAMPLE = 25;

export type CronWindow = {
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
	rateLimitEvents: number;
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
		fetchTimeoutMs: apiConfig.fetchTimeoutMs,
		maxPagesCap: apiConfig.maxPagesCap,
		emailToCount: mailConfig.to.length,
	});

	const fetchStartedAt = Date.now();
	const {
		matched,
		totalFetched,
		totalResultados,
		pagesFetched,
		rateLimitEvents,
	} = await fetchCompraAgilFiltered(
		apiConfig,
		{
			cambioDesde: hourWindow.api.desde,
			cambioHasta: hourWindow.api.hasta,
		},
		apiConfig.filterRules,
	);

	logCompraAgil("fetch_completed", {
		pagesFetched,
		totalResultados,
		totalFetched,
		matched: matched.length,
		rateLimitEvents,
		fetchDurationMs: Date.now() - fetchStartedAt,
		window,
	});

	logCompraAgil("filter_completed", {
		filterRules: apiConfig.filterRules,
		matched: matched.length,
		matchedSample: matched.slice(0, LOG_MATCHED_SAMPLE).map((item) => ({
			codigo: item.codigo,
			reasons: getMatchReasons(item.nombre, apiConfig.filterRules),
		})),
		matchedSampleTruncated: matched.length > LOG_MATCHED_SAMPLE,
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
			totalFetched,
			pagesFetched,
			detailBase: apiConfig.detailBase,
		};

		const { error } = await resend.emails.send({
			from: mailConfig.from,
			to: mailConfig.to,
			subject: `[Nexso] ${matched.length} ${matched.length === 1 ? "oportunidad" : "oportunidades"} en Compra Ágil`,
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
		totalFetched,
		totalResultados,
		matched: matched.length,
		pagesFetched,
		rateLimitEvents,
		emailed,
		window,
		durationMs: Date.now() - startedAt,
	};

	logCompraAgil("run_completed", { ...result });

	return result;
}
