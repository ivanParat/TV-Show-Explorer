"use client";

import { useEffect, useState } from "react";
import FavoritesNavigation from "../components/FavoritesNavigation";
import FavoritesList from "@/app/components/FavoritesList";
import { FavoritesContext } from "@/app/context/FavoritesContext";

const type = "shows";

export default function FavoriteShowsPage() {
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    async function fetchFavorites() {
      const res = await fetch(`/api/favorites/${type}`);
      const data = await res.json();
      const favoritesIds = data.favorites;
      let favs = [];
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
        <FavoritesList favorites={favorites} type={type} />
      </FavoritesContext.Provider>
    </div>
  );
}