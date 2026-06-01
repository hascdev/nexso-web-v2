import { Resend } from "resend";
import { getContactConfig } from "@/lib/contact/config";
import {
  buildContactEmailHtml,
  buildContactEmailText,
} from "@/lib/contact/email-template";
import { parseContactBody } from "@/lib/contact/validate";
import { SITE_NAME } from "@/lib/seo/site";

export async function POST(request: Request) {
  const config = getContactConfig();
  if (!config) {
    console.error("[contact] Missing RESEND_API_KEY, CONTACT_FROM_EMAIL or CONTACT_TO_EMAILS");
    return Response.json(
      { error: "El formulario no está configurado. Intenta más tarde." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;
  if (typeof raw.website === "string" && raw.website.trim() !== "") {
    return Response.json({ ok: true });
  }

  const parsed = parseContactBody(body);
  if (!parsed.ok) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  const { data } = parsed;
  const resend = new Resend(config.apiKey);

  const subject = `[${SITE_NAME}] Contacto web — ${data.name}`;

  const { error } = await resend.emails.send({
    from: config.from,
    to: config.to,
    replyTo: data.email,
    subject,
    html: buildContactEmailHtml(data),
    text: buildContactEmailText(data),
  });

  if (error) {
    console.error("[contact] Resend error:", error);
    return Response.json(
      { error: "No pudimos enviar tu mensaje. Intenta de nuevo." },
      { status: 500 },
    );
  }

  return Response.json({ ok: true });
}
