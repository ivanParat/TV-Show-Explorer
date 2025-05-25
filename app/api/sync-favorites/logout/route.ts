//sinkronizira favorite u bazi s favoritima u cookies

import { NextResponse } from "next/server";
import { sendCookieDataToDB } from "@/app/lib/cookies-db-sync";

export async function POST(req: Request) {
  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  await sendCookieDataToDB(userId);
  return NextResponse.json({ status: "ok" });
}