export type ContactConfig = {
  apiKey: string;
  from: string;
  to: string[];
};

export function getContactConfig(): ContactConfig | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  const toRaw = process.env.CONTACT_TO_EMAILS?.trim();

  if (!apiKey || !from || !toRaw) return null;

  const to = toRaw
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  if (to.length === 0) return null;

  return { apiKey, from, to };
}
