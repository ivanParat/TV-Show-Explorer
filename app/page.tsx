import ShowList from "./components/ShowList";
import { getUniqueShowsFromSchedule } from "./lib/shows";
import { sortShowsByRating } from "./lib/shows";

export default async function Home() {
  const today = new Date().toISOString().split("T")[0];
  const res = await fetch(`https://api.tvmaze.com/schedule/web?date=${today}`, { next: { revalidate: 3600 } });
  const schedule = await res.json();

  const initialShows = getUniqueShowsFromSchedule(schedule);
  const sortedInitialShows = sortShowsByRating(initialShows);

  console.log(sortedInitialShows)

  return (
    <ShowList initialShows={sortedInitialShows} infiniteScroll={true} initialDate={today}/>
  );
}