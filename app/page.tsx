import Shows from "./components/Shows";

export default async function Home() {
  const today = new Date().toISOString().split("T")[0];
  const res = await fetch(`https://api.tvmaze.com/schedule/web?date=${today}`, { next: { revalidate: 3600 } });
  const schedule = await res.json();

  //we get shows from the schedule, and crucially - UNIQUE shows, we mustn't have duplicates
  const showsMap = new Map<number, any>();
  schedule.forEach((entry: any) => {
    const show = entry._embedded.show;
    showsMap.set(show.id, show); // If show.id already exists, it will be overwritten
  });
  const shows = Array.from(showsMap.values());
  shows.sort((a, b) => {
    //ako postoji rating, vrijednost će biti rating, a inače će biti 0
    const ratingA = a.rating?.average ?? 0;
    const ratingB = b.rating?.average ?? 0;
    return ratingB - ratingA; // Descending order
  });  
  console.log(shows)

  return (
    <Shows shows={shows}/>
  );
}