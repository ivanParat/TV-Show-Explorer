//prikazuje serije koje su u korisnikovim favoritima, favoriti se dobivaju slanjem zahtjeva na endpoint koji čita favorite iz cookieja

"use client";

import { useEffect, useState } from "react";
import FavoritesNavigation from "../components/FavoritesNavigation";
import FavoriteShowsList from "../components/FavoriteShowsList";
import { FavoritesContext } from "@/app/context/FavoritesContext";
import { Show } from "@/app/types/types";

const type = "shows";

export default function FavoriteShowsPage() {
  const [favorites, setFavorites] = useState<Show[]>([]);

  useEffect(() => {
    async function fetchFavorites() {
      const res = await fetch(`/api/favorites/${type}`);
      const data = await res.json();
      const favoritesIds = data.favorites;
      const favs = [];
      for (const id of favoritesIds) {
        const resTVMaze = await fetch(`https://api.tvmaze.com/${type}/${id}`);
        const favorite = await resTVMaze.json();
        favs.push(favorite);
      }
      setFavorites(favs);
    }
    fetchFavorites();
  }, []);

  return (
    <div>
      <FavoritesNavigation />
      <FavoritesContext.Provider value={setFavorites}>
        <FavoriteShowsList favorites={favorites} />
      </FavoritesContext.Provider>
    </div>
  );
}