export function getFavoritesClient(type: string): number[] {
  const raw = document.cookie
    .split("; ")
    .find(row => row.startsWith(`favorites-${type}=`))
    ?.split("=")[1];

  try {
    return raw ? JSON.parse(decodeURIComponent(raw)) : [];
  } catch {
    return [];
  }
}
