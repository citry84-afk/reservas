import { NextResponse } from "next/server";
import { processBookingReminders } from "@/lib/reminders";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (process.env.VERCEL_ENV === "production") {
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
  }

  const result = await processBookingReminders();

  return NextResponse.json(result);
}
