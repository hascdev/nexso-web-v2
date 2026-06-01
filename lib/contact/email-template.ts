import type { ContactPayload } from "./validate";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildContactEmailHtml(data: ContactPayload): string {
  const orgRow = data.organization
    ? `<tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Organización</td><td style="padding:8px 0;font-size:14px;">${escapeHtml(data.organization)}</td></tr>`
    : "";

  return `
<!DOCTYPE html>
<html lang="es">
<body style="margin:0;font-family:system-ui,-apple-system,sans-serif;background:#f8fafc;color:#111827;">
  <div style="max-width:560px;margin:24px auto;padding:24px;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;">
    <h1 style="margin:0 0 16px;font-size:20px;">Nuevo mensaje desde nexso.cl</h1>
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:8px 0;color:#6b7280;font-size:14px;width:120px;">Nombre</td>
        <td style="padding:8px 0;font-size:14px;">${escapeHtml(data.name)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#6b7280;font-size:14px;">Correo</td>
        <td style="padding:8px 0;font-size:14px;"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td>
      </tr>
      ${orgRow}
    </table>
    <p style="margin:20px 0 8px;font-size:14px;color:#6b7280;">Mensaje</p>
    <p style="margin:0;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(data.message)}</p>
  </div>
</body>
</html>`.trim();
}

export function buildContactEmailText(data: ContactPayload): string {
  const lines = [
    "Nuevo mensaje desde nexso.cl",
    "",
    `Nombre: ${data.name}`,
    `Correo: ${data.email}`,
  ];
  if (data.organization) lines.push(`Organización: ${data.organization}`);
  lines.push("", "Mensaje:", data.message);
  return lines.join("\n");
}
