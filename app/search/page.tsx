//klijentska komponenta jer inače kada se ponovno traži nešto, ništa se ne mijenja

"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ShowList from "../components/ShowList";
import NotFound from "../not-found";
import Loading from "../loading";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const [shows, setShows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!query) {
      setShows([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const results = await res.json();
        const shows = results.map((result: any) => result.show);
        setShows(shows);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (!query) return <NotFound/>;
  if (error) return <NotFound/>;
  if (loading) return <Loading/>;

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4 text-white">Results for "{query}"</h1>
      <ShowList initialShows={shows} infiniteScroll={false} initialDate="" />
    </div>
  );
}
