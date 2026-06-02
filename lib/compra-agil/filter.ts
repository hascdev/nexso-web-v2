import type { CompraAgilItem } from "./types";

export type FilterRuleId = "software" | "licencia" | "desarrollo" | "plataforma";

export const DEFAULT_FILTER_RULES: FilterRuleId[] = [
	"software",
	"licencia",
	"desarrollo",
	"plataforma",
];

const RULE_LABELS: Record<FilterRuleId, string> = {
	software: "Software",
	licencia: "Licencia (excl. licencia de conducir)",
	desarrollo: "Desarrollo de programa, aplicación o sistema",
	plataforma: "Plataforma (solo contexto digital)",
};

/** Normaliza para comparación: minúsculas y sin tildes. */
export function normalizeNombre(nombre: string): string {
	return nombre
		.toLowerCase()
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "");
}

const LICENCIA_CONDUCIR_EXCLUDE = [
	/licencias?\s+de\s+conducir/,
	/licencias?\s+conducir/,
	/licencias?\s+de\s+conductor/,
	/licencias?\s+clase\s+[a-d]\b/,
	/permisos?\s+de\s+conducir/,
];

const DESARROLLO_INCLUDE = [
	/desarrollo\s+de\s+programas?\b/,
	/desarrollo\s+de\s+aplicaciones?\b/,
	/desarrollo\s+de\s+sistemas?\b/,
	/desarrollo\s+de\s+software\b/,
	/desarrollo\s+app\b/,
];

function matchesLicencia(normalized: string): boolean {
	if (!/licencias?\b/.test(normalized)) return false;
	return !LICENCIA_CONDUCIR_EXCLUDE.some((pattern) =>
		pattern.test(normalized),
	);
}

const PLATAFORMA_DIGITAL_INCLUDE = [
	/plataforma\s+digital\b/,
	/plataforma\s+tecnologica\b/,
	/plataforma\s+software\b/,
	/plataforma\s+web\b/,
	/plataforma\s+(en\s+la\s+)?nube\b/,
	/plataforma\s+cloud\b/,
	/plataforma\s+virtual\b/,
	/plataforma\s+informatica\b/,
	/plataforma\s+online\b/,
	/plataforma\s+saas\b/,
	/plataforma\s+lms\b/,
	/plataforma\s+e[-\s]?learning\b/,
	/plataforma\s+de\s+datos\b/,
	/plataforma\s+de\s+gestion\b/,
	/plataforma\s+de\s+informacion\b/,
	/plataforma\s+iot\b/,
	/plataforma\s+api\b/,
	/plataforma\s+movil\b/,
	/plataforma\s+mobile\b/,
	/plataforma\s+interactiva\b/,
	/plataforma\s+educativa\s+digital\b/,
	/plataforma\s+colaborativa\b/,
	/plataforma\s+integrada\b/,
	/plataforma\s+de\s+aprendizaje\b/,
];

const PLATAFORMA_PHYSICAL_EXCLUDE = [
	/plataforma\s+elevadora/,
	/plataforma\s+de\s+elevacion/,
	/plataforma\s+de\s+carga/,
	/plataforma\s+de\s+altura/,
	/plataforma\s+tijera/,
	/plataforma\s+articulada/,
	/plataforma\s+fija/,
	/plataforma\s+metalica/,
	/plataforma\s+modular/,
	/plataforma\s+de\s+trabajo/,
	/plataforma\s+tipo\s/,
	/plataforma\s+de\s+operaciones/,
];

/** Palabras IT cercanas a «plataforma» (±40 caracteres). */
const PLATAFORMA_DIGITAL_PROXIMITY =
	/\b(software|sistema|digital|web|cloud|nube|virtual|informatic|tecnolog|datos|aplicacion|programa|licencia|servidor|portal|usuario|login|saas|lms|api|iot)\b/;

function matchesPlataforma(normalized: string): boolean {
	if (!/\bplataforma\b/.test(normalized)) return false;
	if (PLATAFORMA_PHYSICAL_EXCLUDE.some((pattern) => pattern.test(normalized))) {
		return false;
	}
	if (PLATAFORMA_DIGITAL_INCLUDE.some((pattern) => pattern.test(normalized))) {
		return true;
	}

	const idx = normalized.indexOf("plataforma");
	const windowStart = Math.max(0, idx - 40);
	const windowEnd = Math.min(normalized.length, idx + 49);
	const nearby = normalized.slice(windowStart, windowEnd);
	return PLATAFORMA_DIGITAL_PROXIMITY.test(nearby);
}

function matchesDesarrollo(normalized: string): boolean {
	return DESARROLLO_INCLUDE.some((pattern) => pattern.test(normalized));
}

const RULE_TESTS: Record<FilterRuleId, (normalized: string) => boolean> = {
	software: (n) => /\bsoftware\b/.test(n),
	licencia: matchesLicencia,
	desarrollo: matchesDesarrollo,
	plataforma: matchesPlataforma,
};

export function parseFilterRules(raw?: string): FilterRuleId[] {
	const source =
		raw?.trim() ||
		process.env.COMPRA_AGIL_KEYWORD?.trim() ||
		process.env.COMPRA_AGIL_KEYWORDS?.trim() ||
		DEFAULT_FILTER_RULES.join(",");

	const aliases: Record<string, FilterRuleId> = {
		software: "software",
		licencia: "licencia",
		licencias: "licencia",
		desarrollo: "desarrollo",
		plataforma: "plataforma",
	};

	const rules = source
		.split(",")
		.map((part) => aliases[part.trim().toLowerCase()])
		.filter((rule): rule is FilterRuleId => rule !== undefined);

	const unique = [...new Set(rules)];
	return unique.length > 0 ? unique : [...DEFAULT_FILTER_RULES];
}

export function getMatchReasons(
	nombre: string,
	enabledRules: FilterRuleId[],
): FilterRuleId[] {
	const normalized = normalizeNombre(nombre);
	return enabledRules.filter((rule) => RULE_TESTS[rule](normalized));
}

export function matchesCompraAgilInterest(
	nombre: string,
	enabledRules: FilterRuleId[],
): boolean {
	return getMatchReasons(nombre, enabledRules).length > 0;
}

export function filterCompraAgilItems(
	items: CompraAgilItem[],
	enabledRules: FilterRuleId[],
): CompraAgilItem[] {
	if (enabledRules.length === 0) return items;
	return items.filter((item) =>
		matchesCompraAgilInterest(item.nombre, enabledRules),
	);
}

export function formatFilterRulesLabel(enabledRules: FilterRuleId[]): string {
	const labels = enabledRules.map((id) => RULE_LABELS[id]);
	if (labels.length === 0) return "";
	if (labels.length === 1) return labels[0];
	if (labels.length === 2) return `${labels[0]} o ${labels[1]}`;
	return `${labels.slice(0, -1).join(", ")} o ${labels.at(-1)}`;
}

/** Resumen corto para asunto de correo. */
export function formatFilterRulesShort(enabledRules: FilterRuleId[]): string {
	return enabledRules.map((id) => RULE_LABELS[id].split(" (")[0]).join(", ");
}
