import { getFavorites as getCookieFavorites, setFavorites as setCookieFavorites } from "./cookies";
import { db } from "@/app/db";
import { favorites } from "@/app/db/schema";
import { eq, and, or } from "drizzle-orm";

const types = ["shows", "episodes", "people"];

export async function populateCookiesWithFavoritesFromDB(userId: string) { //čita koji su korisnikovi favoriti iz baze podataka, te sprema favorite u cookies
  const dbFavorites = await db.query.favorites.findMany({
    where: (favs, { eq }) => eq(favs.userId, userId),
    columns: {
      featureId: true,
      type: true,
    },
  });

  const groupedFavorites = dbFavorites.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item.featureId);
    return acc;
  }, {} as Record<string, number[]>);

  for (const type of types) {
    await setCookieFavorites(type, groupedFavorites[type])
  }
}

export async function sendCookieDataToDB(userId: string) { //Stanje favorita iz cookieja sprema u bazu
  const allCookiesMap = new Map<string, Set<number>>(); 
  const allToInsert: { featureId: number; type: string }[] = [];

  // 1. Dohvati sve cookieje sa favoritima
  for (const type of types) {
    const cookieFavorites = await getCookieFavorites(type);
    const cookieSet = new Set(cookieFavorites);
    allCookiesMap.set(type, cookieSet);
  }

  // 2. Dohvati sve favorite iz baze
  const dbFavorites = await db.query.favorites.findMany({
    where: eq(favorites.userId, userId),
    columns: {
      featureId: true,
      type: true,
    },
  });

  const toDelete: { featureId: number; type: string }[] = [];

  // 3. Usporedi favorite iz baze i cookieja, odluči što izbrisati iz baze
  for (const { featureId, type } of dbFavorites) {
    const cookieSet = allCookiesMap.get(type);
    if (!cookieSet?.has(featureId)) {
      toDelete.push({ featureId, type }); // Ako je favorit prisutan u bazi a ne u cookie-ju, znači da se treba izbrisati u bazi
    }
  }

  // 4. Usporedi favorite iz baze i cookieja, odluči što ubaciti u bazu
  for (const [type, cookieSet] of allCookiesMap.entries()) {
    const dbSet = new Set(
      dbFavorites.filter(f => f.type === type).map(f => f.featureId)
    );

    for (const featureId of cookieSet) {
      if (!dbSet.has(featureId)) {
        allToInsert.push({ featureId, type }); // Ako je favorit prisutan u cookiejima a ne u bazi, znači da se treba dodati u bazu
      }
    }
  }

  // 5. Brisanje iz baze
  if (toDelete.length > 0) {
    await db.delete(favorites).where(
      and(
        eq(favorites.userId, userId),
        or(
          ...toDelete.map(({ featureId, type }) =>
            and(eq(favorites.featureId, featureId), eq(favorites.type, type))
          )
        )
      )
    );
  }

  // 6. Ubacivanje u bazu
  if (allToInsert.length > 0) {
    await db.insert(favorites).values(
      allToInsert.map(({ featureId, type }) => ({
        userId,
        featureId,
        type,
      }))
    );
  }
}