import Image from "next/image";
import Link from "next/link";
import Star from "./components/Star";

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
  console.log(shows)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
      {shows.map((show: any) => (
        <Link href={`/show/${show.id}`}>
          <div key={show.id} className="bg-gray-800 text-white p-4 rounded">
            {show.image?.original && (
              <Image src={show.image.original} alt={show.name} width={210} height={295} />
            )}
            <h2 className="text-xl mt-2">{show.name}</h2>
            <p className="text-sm flex items-end gap-1">
              {show.rating?.average && <Star/>} 
              {show.rating?.average ? show.rating.average.toFixed(1) : 'Rating unavailable'}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}