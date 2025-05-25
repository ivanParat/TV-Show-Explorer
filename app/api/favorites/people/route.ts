//dohvaćanje favorita iz cookieja (GET), postavljanje favorita u cookieje (POST), brisanje favorita iz cookieja (DELETE)

import { getFavorites, setFavorites } from "@/app/lib/cookies";

const type = 'people';

export async function GET() {
  const favorites = await getFavorites(type);
  return Response.json({ favorites });
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body?.featureId)
    return Response.json({ error: "feature id missing" }, { status: 400 });

  const favorites = await getFavorites(type);
  if (!favorites.includes(body.featureId)) {
    favorites.push(body.featureId);
    await setFavorites(type, favorites);
  }

  return Response.json({ ok: true, favorites });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  if (!body?.featureId)
    return Response.json({ error: "feature id missing" }, { status: 400 });

  let favorites = await getFavorites(type);
  favorites = favorites.filter((id) => id !== body.featureId);
  await setFavorites(type, favorites);

  return Response.json({ ok: true, favorites });
}