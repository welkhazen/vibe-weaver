import { NextResponse } from "next/server";
import { LeadInput, validateLeadInput } from "@/lib/validators";

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<LeadInput>;
  const error = validateLeadInput(payload);

  if (error) {
    return NextResponse.json({ ok: false, error }, { status: 400 });
  }

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  }

  return NextResponse.json({ ok: true });
}
