import { signOut } from "next-auth/react";

export async function syncAndSignOut(userId: string) {
  await fetch("/api/logout-sync-favorites", {
    method: "POST",
    body: JSON.stringify({ userId }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  await signOut(); 
}
