import {
  KEYWORDS,
  OG_DESCRIPTION,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from "./site";

export const FAQ_ITEMS = [
  {
    question: "¿Qué es Nexso?",
    answer:
      "Nexso es una empresa chilena de soluciones tecnológicas que alinea software, consultoría TI e integraciones con los objetivos de negocio de organizaciones del sector público y privado.",
  },
  {
    question: "¿Qué servicios ofrece Nexso?",
    answer:
      "Desarrollo de software a medida, consultoría y transformación digital, migración de sistemas legacy, y diseño de APIs y microservicios con integraciones a plataformas como Shopify, Mercado Pago, SAP y herramientas de RRHH.",
  },
  {
    question: "¿Con quién trabaja Nexso?",
    answer:
      "Con instituciones del sector público chileno y empresas privadas que necesitan modernizar procesos, conectar sistemas y cumplir marcos normativos como compras públicas, protección de datos y transformación digital del Estado.",
  },
  {
    question: "¿Cuánto tarda Nexso en entregar una primera maqueta?",
    answer:
      "Nexso puede entregar maquetas funcionales en menos de 24 horas para validar alcance y experiencia antes de avanzar al desarrollo completo.",
  },
] as const;

export function buildJsonLdGraph() {
  const organization = {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: "Nexso SpA",
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    areaServed: {
      "@type": "Country",
      name: "Chile",
    },
    knowsAbout: [...KEYWORDS],
  };

  const webSite = {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_TAGLINE,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "es-CL",
  };

  const webPage = {
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: OG_DESCRIPTION,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "es-CL",
  };

  const professionalService = {
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#service`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: {
      "@type": "Country",
      name: "Chile",
    },
    serviceType: [
      "Desarrollo de software a medida",
      "Consultoría TI",
      "Transformación digital",
      "Integración de sistemas",
      "Migración de sistemas legacy",
    ],
  };

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [organization, webSite, webPage, professionalService, faqPage],
  };
}
