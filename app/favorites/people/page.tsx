"use client";

import { useEffect, useState } from "react";
import FavoritesNavigation from "../components/FavoritesNavigation";
import FavoritePeopleList from "../components/FavoritePeopleList";
import { FavoritesContext } from "@/app/context/FavoritesContext";
import { Person } from "@/app/types/types";

const type = "people";

export default function FavoritePeoplePage() {
  const [favorites, setFavorites] = useState<Person[]>([]);

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
        <FavoritePeopleList favorites={favorites}/>
      </FavoritesContext.Provider>
    </div>
  );
}