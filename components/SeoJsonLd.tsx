import { buildJsonLdGraph } from "@/lib/seo/schema";

export function SeoJsonLd() {
  const graph = buildJsonLdGraph();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
