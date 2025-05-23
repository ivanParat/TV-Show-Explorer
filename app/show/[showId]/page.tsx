import Image from "next/image";
import Link from "next/link";
import Star from "@/app/components/Star";
import FavoriteButton from "@/app/components/FavoriteButton";
import NotFound from "@/app/not-found";

export async function generateMetadata({params}:{params:Promise<{showId: string;}>}){
  const { showId } = await params;
  const res = await fetch(`https://api.tvmaze.com/shows/${showId}`, { next: { revalidate: 3600 } });
  if (!res.ok) return { title: "Show does not exist" };
  const show = await res.json();
  const image = show.image?.original || "/fallback-image.png";
  const summaryText = show.summary?.replace(/<[^>]+>/g, "") || "No summary available";
  return {
    title: `TV Show Explorer | ${show.name}`,
    description: `${show.name} - ${summaryText}`,
    keywords: ["TV", "Show", "Television", "Series", "Season", "Episode", "Cast", "Actor", "Character"],
    openGraph: {
      images: [{ url: image, width: 210, height: 295 }],
    },
  };
}

export default async function ShowPage({params}:{params:Promise<{showId: string;}>}){
  const { showId } = await params;
  const res = await fetch(`https://api.tvmaze.com/shows/${showId}`, { next: { revalidate: 3600 } });
  if (!res.ok){
    return <NotFound/>;
  }
  const show = await res.json();

  return (
    <main className="flex flex-col">
      <div className="flex space-x-6 text-lg font-medium justify-center py-3">
        <Link href={`/show/${showId}/season`}>
          <button className="cursor-pointer hover:text-accent active:text-accent">Episodes</button>
        </Link>
        <Link href={`/show/${showId}/cast`}>
          <button className="cursor-pointer hover:text-accent active:text-accent">Cast</button>
        </Link>
      </div>
      <div className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 px-8 sm:px-0 pt-8 mb-8 sm:pb-0 sm:space-x-8 justify-center items-center sm:items-start">
        <div className="bg-card rounded-xl">
          {show.image?.original && (
            <Image src={show.image.original} alt={show.name} width={300} height={500} priority={true} className="rounded-t-xl"/>
          )}
          <div className="px-3 pb-4 pt-2">
            <h2 className="text-xl font-medium mt-2">{show.name}</h2>
            <div className="flex justify-between">
              <p className="text-sm flex items-end gap-1">
                {show.rating?.average ? <Star/> : <Star unknown={true}/>} 
                {show.rating?.average ? show.rating.average.toFixed(1) : '?'}
              </p>
              <FavoriteButton featureId={show.id} type={'shows'}/>
            </div>
          </div>
        </div>
        <div className="space-y-3 sm:text-lg sm:w-1/3 bg-card rounded-xl px-4 py-6">
          {show.summary && (
            <p>
              <span className="font-semibold">Summary: </span>
              <span>{show.summary.replace(/<[^>]+>/g, "")}</span>
            </p>
          )}
          {show.genres && show.genres.length > 0 && (
            <p>
              <span className="font-semibold">Genres: </span>
              <span>{show.genres.join(', ')}</span>
            </p>
          )}
          {show.type && (
            <p>
              <span className="font-semibold">Type: </span>
              <span>{show.type}</span>
            </p>
          )}
          {show.language && (
            <p>
              <span className="font-semibold">Language: </span>
              <span>{show.language}</span>
            </p>
          )}
          {show.premiered && (
            <p>
              <span className="font-semibold">Premiered: </span>
              <span>{show.premiered}</span>
            </p>
          )}
          {show.ended && (
            <p>
              <span className="font-semibold">Ended: </span>
              <span>{show.ended}</span>
            </p>
          )}
          {show.status && (
            <p>
              <span className="font-semibold">Status: </span>
              <span>{show.status}</span>
            </p>
          )}
          {show.averageRuntime && (
            <p>
              <span className="font-semibold">Average Runtime: </span>
              <span>{show.averageRuntime} min</span>
            </p>
          )}
        </div>

      </div>
    </main>
  );
}