import { Resend } from "resend";
import { formatDateSpanish, formatPrice } from "@/lib/slots";
import { whatsAppLink } from "@/lib/whatsapp";
import type { Booking, Provider, Service } from "@/db/schema";

const apiKey = process.env.RESEND_API_KEY ?? process.env.resend;

const resend = apiKey ? new Resend(apiKey) : null;

const fromEmail =
  process.env.EMAIL_FROM ?? "ReservaYa <onboarding@resend.dev>";

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

type BookingEmailData = {
  booking: Pick<
    Booking,
    | "id"
    | "date"
    | "startTime"
    | "endTime"
    | "clientName"
    | "clientEmail"
    | "clientPhone"
    | "notes"
  >;
  service: Pick<Service, "name" | "durationMinutes" | "priceCents">;
  provider: Pick<Provider, "name" | "email" | "phone" | "whatsapp" | "slug">;
};

function emailLayout(content: string) {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <tr><td style="padding:32px 32px 24px;text-align:center;border-bottom:1px solid #f0f0f0;">
          <span style="font-size:18px;font-weight:600;color:#1d1d1f;">ReservaYa</span>
        </td></tr>
        <tr><td style="padding:32px;">${content}</td></tr>
        <tr><td style="padding:20px 32px 32px;text-align:center;border-top:1px solid #f0f0f0;">
          <span style="font-size:12px;color:#86868b;">ReservaYa — Reservas para profesionales</span>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function detailRow(label: string, value: string) {
  return `<tr>
    <td style="padding:8px 0;font-size:13px;color:#86868b;width:120px;vertical-align:top;">${label}</td>
    <td style="padding:8px 0;font-size:14px;color:#1d1d1f;font-weight:500;">${value}</td>
  </tr>`;
}

function bookingDetailsTable(data: BookingEmailData) {
  const { booking, service, provider } = data;
  const dateFormatted = formatDateSpanish(booking.date);
  const ref = booking.id.slice(0, 8).toUpperCase();

  let rows = [
    detailRow("Servicio", service.name),
    detailRow("Profesional", provider.name),
    detailRow("Fecha", dateFormatted),
    detailRow("Hora", `${booking.startTime} – ${booking.endTime}`),
    detailRow("Duración", `${service.durationMinutes} min`),
    detailRow("Precio", formatPrice(service.priceCents)),
    detailRow("Referencia", ref),
  ];

  if (booking.clientPhone) {
    rows.push(detailRow("Teléfono", booking.clientPhone));
  }
  if (booking.notes) {
    rows.push(detailRow("Notas", booking.notes));
  }

  return `<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;border-radius:12px;padding:4px 16px;margin:24px 0;">
    ${rows.join("")}
  </table>`;
}

function clientConfirmationEmail(data: BookingEmailData) {
  const { provider } = data;
  const contact = provider.whatsapp ?? provider.phone;
  const waBlock = contact
    ? `<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
        <tr><td align="center">
          <a href="${whatsAppLink(contact, `Hola ${provider.name}, tengo una consulta sobre mi reserva`)}" style="display:inline-block;background:#25D366;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:980px;font-size:14px;font-weight:500;">
            WhatsApp
          </a>
        </td></tr>
      </table>`
    : "";

  return emailLayout(`
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:600;color:#1d1d1f;text-align:center;">
      ¡Reserva confirmada!
    </h1>
    <p style="margin:0 0 4px;font-size:15px;color:#86868b;text-align:center;line-height:1.5;">
      Hola ${data.booking.clientName}, tu cita con <strong style="color:#1d1d1f;">${provider.name}</strong> ha quedado registrada.
    </p>
    ${bookingDetailsTable(data)}
    <p style="margin:24px 0 0;font-size:13px;color:#86868b;text-align:center;line-height:1.6;">
      Si necesitas cancelar o modificar tu cita, contacta directamente con ${provider.name}${contact ? ` (${contact})` : ""}.
    </p>
    ${waBlock}
  `);
}

function providerNotificationEmail(data: BookingEmailData) {
  const { booking } = data;
  const dashboardUrl = `${appUrl}/admin/dashboard`;

  return emailLayout(`
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:600;color:#1d1d1f;text-align:center;">
      Nueva reserva
    </h1>
    <p style="margin:0;font-size:15px;color:#86868b;text-align:center;line-height:1.5;">
      <strong style="color:#1d1d1f;">${booking.clientName}</strong> acaba de reservar una cita.
    </p>
    ${bookingDetailsTable(data)}
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
      <tr><td align="center">
        <a href="${dashboardUrl}" style="display:inline-block;background:#1d1d1f;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:980px;font-size:14px;font-weight:500;">
          Ver en el panel
        </a>
      </td></tr>
    </table>
    <p style="margin:16px 0 0;font-size:13px;color:#86868b;text-align:center;">
      Email del cliente: ${booking.clientEmail}
    </p>
  `);
}

function clientReminderEmail(data: BookingEmailData) {
  const { provider, booking, service } = data;
  const dateFormatted = formatDateSpanish(booking.date);

  return emailLayout(`
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:600;color:#1d1d1f;text-align:center;">
      Recordatorio de cita
    </h1>
    <p style="margin:0;font-size:15px;color:#86868b;text-align:center;line-height:1.5;">
      Hola ${booking.clientName}, te recordamos tu cita de <strong style="color:#1d1d1f;">mañana</strong> con ${provider.name}.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;border-radius:12px;padding:16px;margin:24px 0;text-align:center;">
      <tr><td style="font-size:13px;color:#86868b;">${dateFormatted}</td></tr>
      <tr><td style="font-size:28px;font-weight:600;color:#1d1d1f;padding:8px 0;">${booking.startTime}</td></tr>
      <tr><td style="font-size:14px;color:#1d1d1f;">${service.name}</td></tr>
    </table>
    <p style="margin:0;font-size:13px;color:#86868b;text-align:center;line-height:1.6;">
      Si no puedes asistir, contacta con ${provider.name}${provider.phone ? ` (${provider.phone})` : ""} lo antes posible.
    </p>
  `);
}

function providerReminderEmail(data: BookingEmailData) {
  const { booking, service, provider } = data;
  const dateFormatted = formatDateSpanish(booking.date);
  const dashboardUrl = `${appUrl}/admin/dashboard`;

  return emailLayout(`
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:600;color:#1d1d1f;text-align:center;">
      Cita mañana
    </h1>
    <p style="margin:0;font-size:15px;color:#86868b;text-align:center;line-height:1.5;">
      Tienes una cita mañana con <strong style="color:#1d1d1f;">${booking.clientName}</strong>.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;border-radius:12px;padding:16px;margin:24px 0;text-align:center;">
      <tr><td style="font-size:13px;color:#86868b;">${dateFormatted}</td></tr>
      <tr><td style="font-size:28px;font-weight:600;color:#1d1d1f;padding:8px 0;">${booking.startTime}</td></tr>
      <tr><td style="font-size:14px;color:#1d1d1f;">${service.name}</td></tr>
      <tr><td style="font-size:13px;color:#86868b;padding-top:8px;">${booking.clientEmail}${booking.clientPhone ? ` · ${booking.clientPhone}` : ""}</td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
      <tr><td align="center">
        <a href="${dashboardUrl}" style="display:inline-block;background:#1d1d1f;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:980px;font-size:14px;font-weight:500;">
          Ver agenda
        </a>
      </td></tr>
    </table>
  `);
}

export async function sendBookingReminderEmails(
  data: BookingEmailData
): Promise<{ sent: boolean; error?: string }> {
  if (!resend) {
    return { sent: false, error: "Email no configurado" };
  }

  const dateFormatted = formatDateSpanish(data.booking.date);

  try {
    const [clientResult, providerResult] = await Promise.all([
      resend.emails.send({
        from: fromEmail,
        to: data.booking.clientEmail,
        subject: `Recordatorio: cita mañana con ${data.provider.name} — ${dateFormatted}`,
        html: clientReminderEmail(data),
      }),
      resend.emails.send({
        from: fromEmail,
        to: data.provider.email,
        subject: `Mañana: ${data.booking.clientName} — ${dateFormatted} ${data.booking.startTime}`,
        html: providerReminderEmail(data),
      }),
    ]);

    const hasError = clientResult.error || providerResult.error;
    if (clientResult.error) {
      console.error("[email] Error recordatorio cliente:", clientResult.error);
    }
    if (providerResult.error) {
      console.error("[email] Error recordatorio profesional:", providerResult.error);
    }

    return {
      sent: !hasError,
      error: hasError ? "Error parcial al enviar recordatorios" : undefined,
    };
  } catch (err) {
    console.error("[email] Error recordatorio:", err);
    return { sent: false, error: "Error al enviar recordatorios" };
  }
}

export async function sendBookingConfirmationEmails(
  data: BookingEmailData
): Promise<{ sent: boolean; error?: string }> {
  if (!resend) {
    console.warn(
      "[email] RESEND_API_KEY (o resend) no configurada — emails omitidos"
    );
    return { sent: false, error: "Email no configurado" };
  }

  const dateFormatted = formatDateSpanish(data.booking.date);

  try {
    const [clientResult, providerResult] = await Promise.all([
      resend.emails.send({
        from: fromEmail,
        to: data.booking.clientEmail,
        subject: `Confirmación: ${data.service.name} con ${data.provider.name} — ${dateFormatted}`,
        html: clientConfirmationEmail(data),
      }),
      resend.emails.send({
        from: fromEmail,
        to: data.provider.email,
        subject: `Nueva reserva: ${data.booking.clientName} — ${dateFormatted}`,
        html: providerNotificationEmail(data),
      }),
    ]);

    if (clientResult.error) {
      console.error("[email] Error enviando al cliente:", clientResult.error);
    }
    if (providerResult.error) {
      console.error(
        "[email] Error enviando al profesional:",
        providerResult.error
      );
    }

    const hasError = clientResult.error || providerResult.error;
    return {
      sent: !hasError,
      error: hasError ? "Error parcial al enviar emails" : undefined,
    };
  } catch (err) {
    console.error("[email] Error inesperado:", err);
    return { sent: false, error: "Error al enviar emails" };
  }
}

export function isEmailConfigured(): boolean {
  return !!(process.env.RESEND_API_KEY ?? process.env.resend);
}
