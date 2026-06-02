import { Resend } from "resend";
import {
	fetchCompraAgilChanges,
	filterByKeywords,
} from "./client";
import {
	formatKeywordsLabel,
	getCompraAgilConfig,
	getCompraAgilMailConfig,
} from "./config";
import {
	buildCompraAgilEmailHtml,
	buildCompraAgilEmailText,
} from "./email-template";
import { logCompraAgil } from "./logger";
import { getLastCompleteHourWindowChile } from "./timezone";

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
	emailed: boolean;
	window: CronWindow;
	durationMs: number;
};

export async function runCompraAgilCron(): Promise<CronRunResult> {
	const startedAt = Date.now();
	const apiConfig = getCompraAgilConfig();
	const mailConfig = getCompraAgilMailConfig();
	console.log("apiConfig", apiConfig);
	console.log("mailConfig", mailConfig);

	if (!apiConfig) {
		throw new Error("Falta MERCADO_PUBLICO_TICKET en variables de entorno.");
	}
	if (!mailConfig) {
		throw new Error(
			"Faltan RESEND_API_KEY, COMPRA_AGIL_FROM_EMAIL o COMPRA_AGIL_TO_EMAILS.",
		);
	}

	const { desde, hasta, chile, utc } = getLastCompleteHourWindowChile();
	const window: CronWindow = {
		desde: utc.desde,
		hasta: utc.hasta,
		desdeChile: chile.desde,
		hastaChile: chile.hasta,
		timezone: "America/Santiago",
	};

	console.log("fetching compra agil changes", { desde, hasta });

	const { items, pagesFetched, totalResultados } = await fetchCompraAgilChanges(apiConfig, { cambioDesde: desde, cambioHasta: hasta, });
	console.log("items", items.length);

	const matched = filterByKeywords(items, apiConfig.keywords);
	console.log("matched", matched.length);

	logCompraAgil("filter_completed", {
		keywords: apiConfig.keywords,
		matched: matched.length,
		matchedCodigos: matched.map((item) => item.codigo),
	});

	let emailed = false;
	if (matched.length > 0) {
		const resend = new Resend(mailConfig.apiKey);
		const emailPayload = {
			keywordsLabel: formatKeywordsLabel(apiConfig.keywords),
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
			subject: `[Nexso] ${matched.length} Compra Ágil (${apiConfig.keywords.join(", ")})`,
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
