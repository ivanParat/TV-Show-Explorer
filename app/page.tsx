//Home Page - na njemu se prikazuju serije dobivene s API-ja
//Svim zahtjevima na API na svim stranicama je postavljeno da se revalidiraju svakih sat vremena, jer se informacije o serijama ne bi trebale mijenjati prečesto, tako da je dobro imati informacije u cache-u, ali isto se mogu mijenjati pa je potrebno osvježiti nakon nekog vremena

import ShowList from "./components/ShowList";
import { getUniqueShowsFromSchedule, sortShowsByRating } from "./lib/shows";

export default async function Home() {
  const today = new Date().toISOString().split("T")[0];
  const res = await fetch(`https://api.tvmaze.com/schedule/web?date=${today}`, { next: { revalidate: 3600 } }); //Dohvaća se raspored prikazivanja od današnjeg datuma s API-ja
  const schedule = await res.json();

  const initialShows = getUniqueShowsFromSchedule(schedule); //Iz rasporeda se izvlače serije, i to jedinstvene, da se izbjegnu duplikati
  const sortedInitialShows = sortShowsByRating(initialShows); //Serije se silazno sortiraju po prosječnoj ocjeni, tako da se pri vrhu prikažu one serije s većom ocjenom, zatim one s manjom, zatim one bez ocjene

  return (
    <ShowList initialShows={sortedInitialShows} infiniteScroll={true} initialDate={today}/> //Omogućen je infinite scroll - kako se scrolla niže, dohvaćaju se serije koje su se prikazivale ranijih datuma
  );
}