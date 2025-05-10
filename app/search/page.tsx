// app/search/page.tsx
import { notFound } from "next/navigation";
import Shows from "../components/Shows";

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = await searchParams.q;

  if (!query) return notFound();

  const res = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`, {
    next: { revalidate: 3600 },
  });

  const results = await res.json();
  console.log(results)
  const shows = results.map((result: any) => {return result.show})

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4 text-white">Results for "{query}"</h1>
      <Shows shows={shows} />
    </div>
  );
}
