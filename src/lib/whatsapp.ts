const WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM;

export function isWhatsAppConfigured(): boolean {
  return !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    WHATSAPP_FROM
  );
}

/** Enlace wa.me para abrir chat (siempre disponible si hay número) */
export function whatsAppLink(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export async function sendWhatsAppMessage(
  toPhone: string,
  body: string
): Promise<{ sent: boolean }> {
  if (!isWhatsAppConfigured()) {
    return { sent: false };
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID!;
  const authToken = process.env.TWILIO_AUTH_TOKEN!;
  const to = toPhone.startsWith("whatsapp:")
    ? toPhone
    : `whatsapp:${normalizePhone(toPhone)}`;
  const from = WHATSAPP_FROM!.startsWith("whatsapp:")
    ? WHATSAPP_FROM!
    : `whatsapp:${WHATSAPP_FROM}`;

  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ From: from, To: to, Body: body }),
      }
    );

    if (!res.ok) {
      console.error("[whatsapp] Error Twilio:", await res.text());
      return { sent: false };
    }

    return { sent: true };
  } catch (err) {
    console.error("[whatsapp] Error:", err);
    return { sent: false };
  }
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("34")) return `+${digits}`;
  if (digits.length === 9) return `+34${digits}`;
  return `+${digits}`;
}

export function bookingWhatsAppText(data: {
  clientName: string;
  providerName: string;
  serviceName: string;
  date: string;
  time: string;
  type: "confirmation" | "reminder";
}): string {
  if (data.type === "reminder") {
    return `Hola ${data.clientName}, te recordamos tu cita mañana (${data.date} a las ${data.time}) con ${data.providerName} — ${data.serviceName}. ReservaYa`;
  }
  return `Hola ${data.clientName}, tu cita con ${data.providerName} está confirmada: ${data.serviceName}, ${data.date} a las ${data.time}. ReservaYa`;
}
