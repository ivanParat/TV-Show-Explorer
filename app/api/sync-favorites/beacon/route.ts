import { NextResponse } from "next/server";
import { sendCookieDataToDB } from "@/app/lib/cookies-db-sync";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const { userId } = JSON.parse(rawBody);

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    await sendCookieDataToDB(userId);

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    return NextResponse.json({ error: "Invalid or missing JSON body" }, { status: 400 });
  }
}