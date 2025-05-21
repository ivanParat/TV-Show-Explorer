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
    <div className="bg-gray-800 text-white p-4 rounded">
      {show.image?.original && (
        <Image src={show.image.original} alt={show.name} width={210} height={295} priority={true}/>
      )}
      <h2 className="text-xl mt-2">{show.name}</h2>
      <p className="text-sm flex items-end gap-1">
        {show.rating?.average ? <Star/> : <Star unknown={true}/>} 
        {show.rating?.average ? show.rating.average.toFixed(1) : '?'}
      </p>
      {show.type && <p>Type: {show.type}</p>}
      {show.genres && show.genres.length > 0 && <p>Genres: {show.genres.join(', ')}</p>}
      {show.language && <p>Language: {show.language}</p>}
      {show.premiered && <p>Premiered: {show.premiered}</p>}
      {show.ended && <p>Ended: {show.ended}</p>}
      {show.status && <p>Status: {show.status}</p>}
      {show.averageRuntime && <p>Average Runtime: {show.averageRuntime} min</p>}
      {show.summary && show.summary?.replace(/<[^>]+>/g, "")}
      <Link href={`/show/${showId}/season`}>
        <button className="cursor-pointer">View Episodes</button>
      </Link>
      <Link href={`/show/${showId}/cast`}>
        <button className="cursor-pointer">View Cast</button>
      </Link>
      <FavoriteButton featureId={show.id} type={'shows'}/>
    </div>
  );
}