let favorites : number[] = [];
 
export async function GET() {
  return Response.json({ favorites });
}
 
export async function POST(request: Request) {
  const body = await request.json();
  if (!body?.featureId)
    return Response.json({ error: "feature id missing" }, { status: 400 });
 
  if (!favorites.includes(body.featureId)) favorites.push(body.featureId);
 
  return Response.json({ ok: true, favorites });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  if (!body?.featureId)
    return Response.json({ error: "feature id missing" }, { status: 400 });

  favorites = favorites.filter((id) => id !== body.featureId);

  return Response.json({ ok: true, favorites });
}