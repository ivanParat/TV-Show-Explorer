import { NextResponse } from "next/server";
import { sendCookieDataToDB } from "@/app/lib/cookies-db-sync";
import { clearCookies } from "@/app/lib/cookies";

export async function POST(req: Request) {
  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  await sendCookieDataToDB(userId);
  await clearCookies();
  return NextResponse.json({ status: "ok" });
}