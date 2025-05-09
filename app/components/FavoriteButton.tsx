"use client";
import { useState, useTransition, useEffect } from "react";
 
export default function FavoriteButton({ featureId, type, initialSaved }:{featureId:number, type:string, initialSaved?:boolean}) {
  const [saved, setSaved] = useState(initialSaved);   
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (initialSaved != undefined) return; 
    async function fetchSavedStatus() {
      const res = await fetch(`/api/favorites/${type}`, { cache: "no-store" });
      const data = await res.json();
      setSaved(data.favorites.includes(featureId));
    }
    fetchSavedStatus();
  }, [featureId, type]);

  function toggleFavorite() {
    startTransition(async () => {
      const method = saved ? "DELETE" : "POST";
      const res = await fetch(`/api/favorites/${type}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featureId }),
      });
      if (res.ok) setSaved(!saved);
    });
  }
 
  return (
    <button
      disabled={isPending}
      onClick={() => {toggleFavorite(); console.log(featureId); console.log(saved)}}
      className={`px-3 py-1 rounded text-white transition-colors ${
        saved ? "bg-green-600" : "bg-amber-500 hover:bg-amber-600"
      }`}
    >
      {saved ? "Ukloni iz favorita" : isPending ? "Pending..." : "Dodaj u favorite"}
    </button>
  );
}