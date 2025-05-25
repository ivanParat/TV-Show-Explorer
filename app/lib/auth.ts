import { signOut } from "next-auth/react";

export async function syncAndSignOut(userId: string | undefined) { //pošalji zahtjev na endpoint koji će sinkronizirati favorite u bazi s favoritima iz cookieja, te se odlogiraj
  if(!userId) return;
  await fetch("/api/sync-favorites/logout", {
    method: "POST",
    body: JSON.stringify({ userId }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  await signOut(); 
}
