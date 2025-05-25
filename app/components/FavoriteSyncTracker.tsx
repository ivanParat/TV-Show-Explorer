/*Komponenta služi za sinkronizaciju favorita u cookiejima i u bazi. 
Kad se korisnik logira, iz baze se dohvaćaju njegovi favoriti i spremaju u cookies, a kad se odlogira, favoriti iz cookies se spremaju u bazu.
U međuvremenu, kako korisnik dodaje i uklanja stavke iz favorita, to se sprema u cookies, jer je brže i efikasnije nego slati svaki put zahtjev na bazu.
Posao ove komponente je da sinkronizira favorite u bazi s onima iz cookieja ne samo kad se korisnik odlogira, nego i u drugim situacijama, npr
kad se promijeni tab, kad se zatvori tab, kad se ode na drugu stranicu, kad se minimizira browser, te svakih 60 sekundi.
Naravno, kod tih događaja, ne šalje se svaki put zahtjev u bazu, nego se provjerava je li se stanje u cookiejima promijenilo
te se zahtjev šalje samo ako jest.
*/
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
  const lastSyncedRef = useRef<Map<string, Set<number>> | null>(null); //posljednje stanje u cookiejima

  useEffect(() => {
    if(session.status === "unauthenticated"){ //ako nitko nije logiran, cookieji se brišu - ne želimo da informacije o korisnikovim favoritima ostanu nakon što se odlogira
      fetch("/api/sync-favorites/clear-cookies", { method: "POST" });
      return;
    }
    if (session.status !== "authenticated" || !session.data?.user?.id) return; //ako nitko nije logiran, ostale radnje nisu potrebne - ne trebaju se pratiti favoriti jer samo logirani korisnici mogu dodavati u favorite

    const userId = session.data.user.id;

    const init = () => {
      const initial = getAllCookieFavorites();
      lastSyncedRef.current = initial;
    };

    const syncFavoritesIfNeeded = () => {
      if (!lastSyncedRef.current) return;

      const current = getAllCookieFavorites();
      if (hasFavoritesChanged(current, lastSyncedRef.current)) { //ispituje jesu li se favoriti u cookiejima promijenili u odnosu na zadnji put kad je ta informacija pročitana, ako jesu, na endpoint se šalje beacon, a endpoint sinkronizira bazu s cookiejima. sendBeacon je specijaliziran za situacije kada korisnik napušta stranicu, te nam je zato potreban on, a ne fetch. sendBeacon ne traži odgovor od servera
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
    const interval = setInterval(syncFavoritesIfNeeded, 60000); //svakih 60 sekundi

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(interval);
    };
  }, [session.status, session.data?.user?.id]);

  return null;
}