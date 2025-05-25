export function getFavoritesClient(type: string): number[] { //iz klijentske komponente čita favorite određenog tipa(serija, epizoda ili glumac) iz cookies
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
