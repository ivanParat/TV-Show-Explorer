import { cookies } from 'next/headers';

export async function getFavorites(type: string): Promise<number[]> { //čita favorite određenog tipa(serija, epizoda ili glumac) iz cookies
  const cookieStore = await cookies();
  const raw = cookieStore.get(`favorites-${type}`)?.value ?? '[]';
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function setFavorites(type: string, favorites: number[]) { //postavlja favorite određenog tipa(serija, epizoda ili glumac) u cookies
  const cookieStore = await cookies();
  cookieStore.set(`favorites-${type}`, JSON.stringify(favorites), {
    httpOnly: false,
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 dana
  });
}

export async function clearCookies() {
  const types = ["shows", "episodes", "people"];
  for (const type of types) {
    await setFavorites(type, []);
  }
}
