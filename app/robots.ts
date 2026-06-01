import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";

const AI_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "PerplexityBot",
  "ClaudeBot",
  "anthropic-ai",
  "Google-Extended",
  "Applebot-Extended",
] as const;

export default function robots(): MetadataRoute.Robots {
  const allowAll = { userAgent: "*", allow: "/" as const };

  const aiRules = AI_BOTS.map((userAgent) => ({
    userAgent,
    allow: "/" as const,
  }));

  return {
    rules: [allowAll, ...aiRules],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
