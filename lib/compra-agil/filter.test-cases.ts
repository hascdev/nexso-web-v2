import {
	DEFAULT_FILTER_RULES,
	getMatchReasons,
	matchesCompraAgilInterest,
} from "./filter";

const CASES = [
	{
		nombre:
			"ADQUISICION DE TERMOLAMINADORA PROFESIONAL PARA EL SELLADO DE LICENCIAS DE CONDUCIR",
		expectMatch: false,
		note: "licencias de conducir — excluir",
	},
	{
		nombre:
			"Adquisición de licencia de software ESRI Chile, para Proyecto ATA2395",
		expectMatch: true,
		expectRules: ["software", "licencia"] as const,
		note: "licencia + software",
	},
	{
		nombre: "Servicio de Plataforma Web de Gestión Comunal",
		expectMatch: true,
		expectRules: ["plataforma"] as const,
		note: "plataforma web",
	},
	{
		nombre:
			"Adquisición de Semáforo Portátil y Pizarra Magnética para Gabinete de Licencias de Conducir - Dirección de Administración y Finanzas",
		expectMatch: false,
		note: "licencias de conducir — excluir",
	},
	{
		nombre: "PLATAFORMA DIGITAL LICEOS DAEM OSORNO",
		expectMatch: true,
		expectRules: ["plataforma"] as const,
		note: "plataforma digital",
	},
	{
		nombre:
			"SERVICIO DE AMBULANCIA CON CHOFER Y PARAMÉDICO PARA EL DESARROLLO DE EVENTOS REGIONALES DE LOS JUEGOS DEPORTIVOS ESCOLARES",
		expectMatch: false,
		note: "desarrollo de eventos — no es TI",
	},
];

const rules = DEFAULT_FILTER_RULES;
let passed = 0;

console.log("Filtro Compra Ágil — casos de prueba\n");
console.log(`Reglas activas: ${rules.join(", ")}\n`);
console.log("-".repeat(80));

for (const [i, c] of CASES.entries()) {
	const matched = matchesCompraAgilInterest(c.nombre, rules);
	const reasons = getMatchReasons(c.nombre, rules);
	const rulesOk =
		!("expectRules" in c && c.expectRules) ||
		(c.expectRules.every((r) => reasons.includes(r)) &&
			reasons.every((r) => c.expectRules!.includes(r as never)));
	const ok = matched === c.expectMatch && rulesOk;
	if (ok) passed++;

	console.log(`#${i + 1} [${ok ? "PASS" : "FAIL"}] ${c.note}`);
	console.log(
		`   ${c.nombre.slice(0, 76)}${c.nombre.length > 76 ? "…" : ""}`,
	);
	console.log(
		`   Esperado: match=${c.expectMatch}${"expectRules" in c && c.expectRules ? ` rules=[${c.expectRules.join(", ")}]` : ""}`,
	);
	console.log(
		`   Obtenido: match=${matched} rules=[${reasons.join(", ") || "—"}]`,
	);
	console.log();
}

console.log("-".repeat(80));
console.log(`Resultado: ${passed}/${CASES.length} passed`);
process.exit(passed === CASES.length ? 0 : 1);
