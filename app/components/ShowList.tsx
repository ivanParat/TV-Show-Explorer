"use client"

import ShowCard from "./ShowCard";
import { useState, useEffect } from "react";
import { useInView } from 'react-intersection-observer'
import { sortShowsByRating } from "../lib/shows";
import GenreCheckbox from "./GenreCheckbox";
import { Show } from "../types/types";

export default function ShowList({initialShows, infiniteScroll, initialDate}: {initialShows: Show[], infiniteScroll: boolean, initialDate: string}) {

  //ako infinite scroll nije potreban (nije potreban kod search), ovo je sve što treba

  const [shows, setShows] = useState<Show[]>(initialShows);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState<string>(initialDate);
  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView) {
      loadMoreShows()
    }
  }, [inView, currentDate]) //poziva se kada se dovoljno spustimo(inView), i ako smo već jednom učitali nove podatke, ali ih nije bilo dovoljno da ref nestane iz vidnog polja(currentDate)

  //ako infinite scroll nije potreban (nije potreban kod search), ovo je sve što treba

  const filteredShows = selectedGenres.length === 0
  ? shows
  : shows.filter(show =>
      show.genres?.some((genre: string) => selectedGenres.includes(genre))
    );

  if(!infiniteScroll){
    return(
      <div>
        <GenreCheckbox selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres}/>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
        {filteredShows.map((show: Show) => (
          <ShowCard key={show.id} show={show}/>
        ))}
        </div>
      </div>
    );
  }

  //ako je potreban infinite scroll (potreban je kod home page), potrebno je i ovo ispod

  const loadMoreShows = async () => {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    const previousDay = prevDate.toISOString().split("T")[0];

    const res = await fetch(`https://api.tvmaze.com/schedule/web?date=${previousDay}`, { next: { revalidate: 3600 } });
    const schedule = await res.json();

    //we get shows from the schedule, and crucially - UNIQUE shows, we mustn't have duplicates
    const showsMap = new Map<number, Show>();
    schedule.forEach((entry: {_embedded: {show: Show}}) => {
      const show = entry._embedded.show;
      showsMap.set(show.id, show); // If show.id already exists, it will be overwritten
    });

    // Add new unique shows to existing ones
    setShows(prevShows => {
      const existingIds = new Set(prevShows.map(s => s.id));
      const newUniqueShows = Array.from(showsMap.values()).filter(s => !existingIds.has(s.id));
      const newUniqueShowsSorted = sortShowsByRating(newUniqueShows);
      return [...prevShows, ...newUniqueShowsSorted];
    });

    setCurrentDate(previousDay);
  }

  return (
    <div>
      <GenreCheckbox selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres}/>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
        {filteredShows.map((show: Show) => (
          <ShowCard key={show.id} show={show}/>
        ))}
        <div ref={ref}>
          Loading...
        </div>
      </div>
    </div>
  );
}