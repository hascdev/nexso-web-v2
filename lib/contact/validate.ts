const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = { name: 120, email: 254, org: 200, message: 5000 } as const;

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
  organization?: string;
};

export function parseContactBody(
  body: unknown,
): { ok: true; data: ContactPayload } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Datos inválidos." };
  }

  const raw = body as Record<string, unknown>;
  const name = String(raw.name ?? "").trim();
  const email = String(raw.email ?? "").trim();
  const message = String(raw.message ?? "").trim();
  const organization = String(raw.organization ?? "").trim();

  if (!name) return { ok: false, error: "El nombre es obligatorio." };
  if (name.length > MAX.name) {
    return { ok: false, error: "El nombre es demasiado largo." };
  }
  if (!email) return { ok: false, error: "El correo es obligatorio." };
  if (!EMAIL_RE.test(email) || email.length > MAX.email) {
    return { ok: false, error: "Revisa el formato del correo." };
  }
  if (!message) return { ok: false, error: "El mensaje es obligatorio." };
  if (message.length > MAX.message) {
    return { ok: false, error: "El mensaje es demasiado largo." };
  }
  if (organization.length > MAX.org) {
    return { ok: false, error: "El nombre de organización es demasiado largo." };
  }

  return {
    ok: true,
    data: {
      name,
      email,
      message,
      ...(organization ? { organization } : {}),
    },
  };
}
