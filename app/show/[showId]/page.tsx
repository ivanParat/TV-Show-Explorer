import Image from "next/image";
import Link from "next/link";
import Star from "@/app/components/Star";
import SanitizedHTML from "@/app/components/SanitizedHTML";
import FavoriteButton from "@/app/components/FavoriteButton";

export default async function ShowPage({params}:{params:{showId: string;}}){
  const { showId } = await params;
  const res = await fetch(`https://api.tvmaze.com/shows/${showId}`, { next: { revalidate: 3600 } });
  const show = await res.json();
  console.log(show);

  return (
    <div className="bg-gray-800 text-white p-4 rounded">
      {show.image?.original && (
        <Image src={show.image.original} alt={show.name} width={210} height={295} priority={true}/>
      )}
      <h2 className="text-xl mt-2">{show.name}</h2>
      <p className="text-sm flex items-end gap-1">
        {show.rating?.average && <Star/>} 
        {show.rating?.average ? show.rating.average.toFixed(1) : 'Rating unavailable'}
      </p>
      {show.type && <p>Type: {show.type}</p>}
      {show.genres && show.genres.length > 0 && <p>Genres: {show.genres.join(', ')}</p>}
      {show.language && <p>Language: {show.language}</p>}
      {show.premiered && <p>Premiered: {show.premiered}</p>}
      {show.ended && <p>Ended: {show.ended}</p>}
      {show.status && <p>Status: {show.status}</p>}
      {show.averageRuntime && <p>Average Runtime: {show.averageRuntime} min</p>}
      {show.summary && <SanitizedHTML html={show.summary} />}
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