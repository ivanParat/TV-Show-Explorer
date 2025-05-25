//tipka u obliku srca koja dodaje seriju, epizodu ili glumca u favorite, ili uklanja
//favoriti se čitaju i spremaju u cookies slanjem zahtjeva na endpoint

"use client";
import { useState, useTransition, useEffect, useContext } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { useSession } from "next-auth/react";
import { FavoritesContext } from "../context/FavoritesContext";
 
export default function FavoriteButton({ featureId, type, initialSaved }:{featureId:number, type:string, initialSaved?:boolean}) {
  const [saved, setSaved] = useState(initialSaved);   
  const [isPending, startTransition] = useTransition();
  const { status } = useSession();
  const setFavorites = useContext(FavoritesContext);

  useEffect(() => {
    if (initialSaved != undefined || status !== "authenticated") return; //ako komponenta prima initialSaved kao props, nije potrebno provjeriti favorite, ali u nijednom slučaju na stranici komponenta ne prima initalSaved. Također, gosti ne mogu dodavati u favorite
    async function fetchSavedStatus() {
      const res = await fetch(`/api/favorites/${type}`);
      const data = await res.json();
      setSaved(data.favorites.includes(featureId));
    }
    fetchSavedStatus();
  }, [status, featureId, initialSaved, type]);

  if(status !== "authenticated") return null; //Tipka se ne prikazuje ako korisnik nije logiran, tako da gosti ne mogu dodavati u favorite

  function toggleFavorite(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation(); //Tipka se može nalaziti unutar linka, pa ovo sprječava da se ode na drugu stranicu kad se stisne tipka
    e.preventDefault(); 
    startTransition(async () => { //useTransition hook služi kako bi izbjegli blokiranje sučelja dok čekamo odgovor
      const method = saved ? "DELETE" : "POST";
      const res = await fetch(`/api/favorites/${type}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featureId }),
      });
  
      if (res.ok) {
        setSaved(!saved);
        if (method === "DELETE"){
          setFavorites?.((prevFavorites) => {
              return prevFavorites.filter((favorite) => favorite.id !== featureId);
          });
        }
      }
    });
  }
 
  return (
    <button
    onClick={toggleFavorite} 
    disabled={isPending} //tipka se ne može koristiti dok se čeka odgovor
    className={`text-red-500 cursor-pointer ${
      isPending ? "opacity-50 cursor-not-allowed" : "hover:text-red-400 active:text-red-400"
    }`}
    aria-label={saved ? "Remove from favorites" : "Add to favorites"}
    >
      {saved ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
    </button>
  );
}