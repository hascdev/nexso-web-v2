"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

const BRAND_LOGOS = [
  { name: "Shopify", slug: "shopify" },
  { name: "WooCommerce", slug: "woocommerce" },
  { name: "VTex", slug: "vtex" },
  { name: "Mercado Pago", slug: "mercadopago" },
  { name: "Stripe", slug: "stripe" },
  { name: "Netsuite", slug: null },
  { name: "SAP", slug: "sap" },
  { name: "HubSpot", slug: "hubspot" },
  { name: "Google Cloud", slug: "googlecloud" },
  { name: "AWS", slug: null },
  { name: "Jira", slug: "jira" },
  { name: "Notion", slug: "notion" },
  { name: "Zapier", slug: "zapier" },
  { name: "Buk", slug: null },
  { name: "Talana", slug: null },
] as const;

function LogoStrip({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center gap-14 pr-14"
      aria-hidden={ariaHidden || undefined}
    >
      {BRAND_LOGOS.map((logo) =>
        logo.slug ? (
          <Image
            key={logo.name}
            src={`https://cdn.simpleicons.org/${logo.slug}`}
            alt={ariaHidden ? "" : logo.name}
            width={32}
            height={32}
            unoptimized
            className="h-8 w-auto shrink-0 opacity-80 grayscale"
          />
        ) : (
          <span
            key={logo.name}
            className="shrink-0 text-lg font-semibold tracking-tight text-faint"
            aria-hidden={ariaHidden}
          >
            {logo.name}
          </span>
        ),
      )}
    </div>
  );
}

export function IntegrationLogos() {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div
        className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 px-4"
        aria-label="Plataformas e integraciones compatibles"
      >
        <LogoStrip />
      </div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)]"
      aria-label="Plataformas e integraciones compatibles"
    >
      <motion.div
        className="flex w-max will-change-transform"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 36,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <LogoStrip />
        <LogoStrip ariaHidden />
      </motion.div>
    </div>
  );
}
