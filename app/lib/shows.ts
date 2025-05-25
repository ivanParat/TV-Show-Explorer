import { Show } from "../types/types";

export function getUniqueShowsFromSchedule(schedule: {_embedded: {show: Show}}[]): Show[] { // Funkcija stvara mapu sa elementima id i serija tako da bi se iz rasporeda mogle izvući jedinstvene serije
  const showsMap = new Map<number, Show>();
  schedule.forEach((entry: {_embedded: {show: Show}}) => {
    const show = entry._embedded.show;
    showsMap.set(show.id, show); // Ako show.id već postoji u mapi, taj red će samo biti prebrisan, neće se dodati novi red
  });
  return Array.from(showsMap.values()); 
}

export function sortShowsByRating(shows: Show[]): Show[] {
  return shows.slice().sort((a, b) => {
    // Ako postoji rating, vrijednost će biti rating, a inače će biti 0
    const ratingA = a.rating?.average ?? 0;
    const ratingB = b.rating?.average ?? 0;
    return ratingB - ratingA; // Silazno
  });
}
