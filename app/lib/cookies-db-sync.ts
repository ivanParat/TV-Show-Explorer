import { getFavorites as getCookieFavorites, setFavorites as setCookieFavorites } from "./cookies";
import { db } from "@/app/db";
import { favorites } from "@/app/db/schema";
import { eq, and, or } from "drizzle-orm";

const types = ["shows", "episodes", "people"];

export async function populateCookiesWithFavoritesFromDB(userId: string) {
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

export async function sendCookieDataToDB(userId: string) {
  const allCookiesMap = new Map<string, Set<number>>(); 
  const allToInsert: { featureId: number; type: string }[] = [];

  // 1. Build a complete map of cookie favorites by type
  for (const type of types) {
    const cookieFavorites = await getCookieFavorites(type);
    const cookieSet = new Set(cookieFavorites);
    allCookiesMap.set(type, cookieSet);
  }

  // 2. Get all current DB favorites for this user (1 query)
  const dbFavorites = await db.query.favorites.findMany({
    where: eq(favorites.userId, userId),
    columns: {
      featureId: true,
      type: true,
    },
  });

  const toDelete: { featureId: number; type: string }[] = [];

  // 3. Compare DB vs cookie
  for (const { featureId, type } of dbFavorites) {
    const cookieSet = allCookiesMap.get(type);
    if (!cookieSet?.has(featureId)) {
      toDelete.push({ featureId, type }); // present in DB but not in cookie
    }
  }

  // 4. Determine what to insert
  for (const [type, cookieSet] of allCookiesMap.entries()) {
    const dbSet = new Set(
      dbFavorites.filter(f => f.type === type).map(f => f.featureId)
    );

    for (const featureId of cookieSet) {
      if (!dbSet.has(featureId)) {
        allToInsert.push({ featureId, type });
      }
    }
  }

  // 5. Batch delete (if needed)
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

  // 6. Batch insert (if needed)
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