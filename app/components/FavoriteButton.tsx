"use client";
import { useState, useTransition, useEffect } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
 
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
    onClick={toggleFavorite}
    disabled={isPending}
    className={`text-red-500 cursor-pointer ${
      isPending ? "opacity-50 cursor-not-allowed" : "hover:text-red-400 active:text-red-400"
    }`}
    aria-label={saved ? "Remove from favorites" : "Add to favorites"}
    >
      {saved ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
    </button>
  );
}