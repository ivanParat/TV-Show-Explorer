import Image from "next/image";
import Star from "@/app/components/Star";
import SanitizedHTML from "@/app/components/SanitizedHTML";
import FavoriteButton from "@/app/components/FavoriteButton";
import NotFound from "@/app/not-found";

export default async function SeasonPage({params}:{params:{showId: string; episodeId: string}}){
  const { showId, episodeId } = await params;
  const res = await fetch(`https://api.tvmaze.com/episodes/${episodeId}`, { next: { revalidate: 3600 } });
  if (!res.ok){
    return <NotFound/>;
  }
  const episode = await res.json();
  console.log(episode);
  return(
    <div>
      {episode.image?.original &&  <Image src={episode.image.original} alt={episode.name} width={300} height={300} priority={true}/>}
      <p>S{episode.season} E{episode.number} - {episode.name}</p>
      <p className="text-sm flex items-end gap-1">
        {episode.rating?.average && <Star/>} 
        {episode.rating?.average ? episode.rating.average.toFixed(1) : 'Rating unavailable'}
      </p>
      {episode.summary && <SanitizedHTML html={episode.summary} />}
      {episode.airdate && <p>Airdate: {episode.airdate}</p>}
      {episode.runtime && <p>Runtime: {episode.runtime} min</p>}
      <FavoriteButton featureId={episode.id} type="episodes"/>
    </div>
  );
}