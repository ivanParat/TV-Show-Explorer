import Image from "next/image";
import FavoriteButton from "@/app/components/FavoriteButton";
import Star from "@/app/components/Star";
import Link from "next/link";
import { Episode } from "@/app/types/types";

export default function FavoriteEpisodesList({favorites}: {favorites: Episode[]}) {
  return(
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
      {favorites.map((episode: Episode) => (
        <div key={episode.id}>
          {episode.image?.original &&  <Image src={episode.image.original} alt={episode.name} width={300} height={300} priority={true}/>}
          <p>S{episode.season} E{episode.number} - {episode.name}</p>
          {episode._links?.show?.name && episode._links?.show?.href && <Link href={`/show/${episode._links.show.href.split("/").pop()}`}>Show: {episode._links.show.name}</Link>}
          <p className="text-sm flex items-end gap-1">
            {episode.rating?.average && <Star/>} 
            {episode.rating?.average ? episode.rating.average.toFixed(1) : 'Rating unavailable'}
          </p>
          {episode.summary && episode.summary?.replace(/<[^>]+>/g, "")}
          {episode.airdate && <p>Airdate: {episode.airdate}</p>}
          {episode.runtime && <p>Runtime: {episode.runtime} min</p>}
          <FavoriteButton featureId={episode.id} type="episodes"/>
        </div>
      ))}
    </div>
  );
}
