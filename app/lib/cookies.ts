import { cookies } from 'next/headers';

export async function getFavorites(type: string): Promise<number[]> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(`favorites-${type}`)?.value ?? '[]';
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function setFavorites(type: string, favorites: number[]) {
  const cookieStore = await cookies();
  cookieStore.set(`favorites-${type}`, JSON.stringify(favorites), {
    httpOnly: false,
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}
