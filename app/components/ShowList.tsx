"use client"

import ShowCard from "./ShowCard";
import { useState, useEffect } from "react";
import { useInView } from 'react-intersection-observer'
import { sortShowsByRating } from "../lib/shows";
import GenreSelectDropdown from "./GenreSelectDropdown";
import { Show } from "../types/types";
import Grid from "./layout/Grid";

export default function ShowList({initialShows, infiniteScroll, initialDate}: {initialShows: Show[], infiniteScroll: boolean, initialDate: string}) {
  const [shows, setShows] = useState<Show[]>(initialShows);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState<string>(initialDate);
  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView) {
      loadMoreShows()
    }
  }, [inView, currentDate]) //poziva se kada se dovoljno spustimo(inView), i ako smo već jednom učitali nove podatke, ali ih nije bilo dovoljno da ref nestane iz vidnog polja(currentDate)

  const filteredShows = selectedGenres.length === 0
  ? shows
  : shows.filter(show =>
      show.genres?.some((genre: string) => selectedGenres.includes(genre))
    );//filtriranje serija - uzimaju se samo oni čiji je žanr odabran u izborniku za žanrove
 
  //ako infinite scroll nije potreban (nije potreban kod search stranice), ovo je sve što treba u return-u
  if(!infiniteScroll){
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

  //ako je potreban infinite scroll (potreban je kod home page), potrebno je i ovo ispod

  const loadMoreShows = async () => { //učitavaju se serije prikazivane prethodnog dana
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    const previousDay = prevDate.toISOString().split("T")[0];

    const res = await fetch(`https://api.tvmaze.com/schedule/web?date=${previousDay}`, { next: { revalidate: 3600 } });
    const schedule = await res.json();

    //izvlačenje jedinstvenih serija iz rasporeda
    const showsMap = new Map<number, Show>();
    schedule.forEach((entry: {_embedded: {show: Show}}) => {
      const show = entry._embedded.show;
      showsMap.set(show.id, show); 
    });

    // Dodavanje novih jedinstvenih serija postojećim - dodaju se samo one koje već nisu u listi serija
    setShows(prevShows => {
      const existingIds = new Set(prevShows.map(s => s.id));
      const newUniqueShows = Array.from(showsMap.values()).filter(s => !existingIds.has(s.id));
      const newUniqueShowsSorted = sortShowsByRating(newUniqueShows);
      return [...prevShows, ...newUniqueShowsSorted];
    });

    setCurrentDate(previousDay);
  }

  return (
    <main className="flex flex-col">
      <GenreSelectDropdown selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres}/>
      <Grid>
        {filteredShows.map((show: Show) => (
          <ShowCard key={show.id} show={show}/>
        ))}
        <div ref={ref} className="text-3xl font-bold"> {/*ako scrollamo do ovog div-a, poziva se useEffect koji učitava još serija*/}
          ...
        </div>
      </Grid>
    </main>
  );
}