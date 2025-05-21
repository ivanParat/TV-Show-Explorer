"use client"

import ShowCard from "@/app/components/ShowCard";
import { useState } from "react";
import GenreSelectDropdown from "@/app/components/GenreSelectDropdown";
import { Show } from "@/app/types/types";

export default function FavoriteShowsList({favorites}: {favorites: Show[]}) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const filteredShows = selectedGenres.length === 0
  ? favorites
  : favorites.filter(show =>
      show.genres?.some((genre: string) => selectedGenres.includes(genre))
    );

  return(
    <div>
      <GenreSelectDropdown selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres}/>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
      {filteredShows.map((show: Show) => (
        <ShowCard key={show.id} show={show}/>
      ))}
      </div>
    </div>
  );
}