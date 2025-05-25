//briše favorite iz cookieja

import { NextResponse } from "next/server";
import { clearCookies } from "@/app/lib/cookies";

export async function POST() {
  try {
    await clearCookies();
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Failed to clear cookies:", error);
    return NextResponse.json({ error: "Failed to clear cookies" }, { status: 500 });
  }
}
