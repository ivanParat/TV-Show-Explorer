export async function isFeatureSaved(type: string, featureId: number){
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/favorites/${type}`, {
    cache: "no-store",
  });
  const data = await res.json();
  console.log(data)
  return data.favorites.includes(featureId);
}

export async function getFavorites(type: string){
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/favorites/${type}`, {
    cache: "no-store",
  });
  const data = await res.json();
  console.log(data)
  return data.favorites
} 
