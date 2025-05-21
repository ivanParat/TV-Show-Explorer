"use client"

import ShowCard from "@/app/components/ShowCard";
import { useState } from "react";
import GenreSelectDropdown from "@/app/components/GenreSelectDropdown";
import { Show } from "@/app/types/types";
import Grid from "@/app/components/layout/Grid";

export default function FavoriteShowsList({favorites}: {favorites: Show[]}) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const filteredShows = selectedGenres.length === 0
  ? favorites
  : favorites.filter(show =>
      show.genres?.some((genre: string) => selectedGenres.includes(genre))
    );

  return(
    <main className="flex flex-col">
      <GenreSelectDropdown selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres}/>
      <Grid>
      {filteredShows.map((show: Show) => (
        <ShowCard key={show.id} show={show}/>
      ))}
      </Grid>
    </main>
  );
}