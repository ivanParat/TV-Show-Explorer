"use client";

import { useEffect, useRef } from "react";
import { getFavoritesClient } from "../lib/cookies-client";
import { useSession } from "next-auth/react";

const types = ["shows", "episodes", "people"];

function getAllCookieFavorites() {
  const allCookiesMap = new Map<string, Set<number>>();
  for (const type of types) {
    const cookieFavorites = getFavoritesClient(type);
    const cookieSet = new Set(cookieFavorites);
    allCookiesMap.set(type, cookieSet);
  }
  return allCookiesMap;
}

function serializeFavorites(map: Map<string, Set<number>>): string {
  const plainObject: Record<string, number[]> = {};
  for (const [key, value] of map.entries()) {
    plainObject[key] = Array.from(value);
  }
  return JSON.stringify(plainObject);
}

function hasFavoritesChanged(
  current: Map<string, Set<number>>,
  last: Map<string, Set<number>>
) {
  return serializeFavorites(current) !== serializeFavorites(last);
}

export default function FavoriteSyncTracker() {
  const session = useSession();
  const lastSyncedRef = useRef<Map<string, Set<number>> | null>(null);

  useEffect(() => {
    if(session.status === "unauthenticated"){
      fetch("/api/sync-favorites/clear-cookies", { method: "POST" });
      return;
    }
    if (session.status !== "authenticated" || !session.data?.user?.id) return;

    const userId = session.data.user.id;

    const init = () => {
      const initial = getAllCookieFavorites();
      lastSyncedRef.current = initial;
    };

    const syncFavoritesIfNeeded = () => {
      if (!lastSyncedRef.current) return;

      const current = getAllCookieFavorites();
      if (hasFavoritesChanged(current, lastSyncedRef.current)) {
        const data = { userId };
        const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
        navigator.sendBeacon("/api/sync-favorites/beacon", blob);
        lastSyncedRef.current = current;
      }
    };

    init();

    const handleUnload = () => syncFavoritesIfNeeded();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        syncFavoritesIfNeeded();
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    const interval = setInterval(syncFavoritesIfNeeded, 60000);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(interval);
    };
  }, [session.status]);

  return null;
}