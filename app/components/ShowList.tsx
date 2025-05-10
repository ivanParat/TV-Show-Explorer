"use client"

import ShowCard from "./ShowCard";
import { useState, useEffect } from "react";
import { useInView } from 'react-intersection-observer'
import { sortShowsByRating } from "../lib/shows";

export default function ShowList({initialShows, infiniteScroll, initialDate}: {initialShows: any, infiniteScroll: boolean, initialDate: string}) {

  //ako infinite scroll nije potreban (kod search), ovo je sve što treba
  if(!infiniteScroll){
    return(
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
      {initialShows.map((show: any) => (
        <ShowCard key={show.id} show={show}/>
      ))}
      </div>
    );
  }

  //ako je potreban infinite scroll (kod home page), potrebno je i ovo ispod

  const [shows, setShows] = useState<any[]>(initialShows);
  const [currentDate, setCurrentDate] = useState<string>(initialDate);
  const { ref, inView } = useInView()

  const loadMoreShows = async () => {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    const previousDay = prevDate.toISOString().split("T")[0];

    const res = await fetch(`https://api.tvmaze.com/schedule/web?date=${previousDay}`, { next: { revalidate: 3600 } });
    const schedule = await res.json();

    //we get shows from the schedule, and crucially - UNIQUE shows, we mustn't have duplicates
    const showsMap = new Map<number, any>();
    schedule.forEach((entry: any) => {
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

  useEffect(() => {
    if (inView) {
      loadMoreShows()
    }
  }, [inView])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
      {shows.map((show: any) => (
        <ShowCard key={show.id} show={show}/>
      ))}
      <div ref={ref}>
        Loading...
      </div>
    </div>
  );
}