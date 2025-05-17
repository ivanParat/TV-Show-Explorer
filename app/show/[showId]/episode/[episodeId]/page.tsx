import Image from "next/image";
import Star from "@/app/components/Star";
import FavoriteButton from "@/app/components/FavoriteButton";
import NotFound from "@/app/not-found";

export async function generateMetadata({params}:{params:{showId: string; episodeId: string}}){
  const { showId, episodeId } = await params;

  const res = await fetch(`https://api.tvmaze.com/shows/${showId}`, { next: { revalidate: 3600 } });
  if (!res.ok) return { title: "Show does not exist" };
  const show = await res.json();

  const resEpisode = await fetch(`https://api.tvmaze.com/episodes/${episodeId}`, { next: { revalidate: 3600 } });
  if (!resEpisode.ok) return { title: "Episode does not exist" };
  const episode = await resEpisode.json();

  const image = episode.image?.original || "/fallback-image.png";
  const summaryText = episode.summary?.replace(/<[^>]+>/g, "") || "No summary available";

  return {
    title: `TV Show Explorer | ${show.name} | S${episode.season} E${episode.number} - ${episode.name}`,
    description: `${episode.name} - ${summaryText}`,
    keywords: ["TV", "Show", "Television", "Series", "Season", "Episode", "Cast", "Actor", "Character"],
    openGraph: {
      images: [{ url: image, width: 210, height: 295 }],
    },
  };
}

export default async function SeasonPage({params}:{params:{showId: string; episodeId: string}}){
  const { showId, episodeId } = await params;
  const res = await fetch(`https://api.tvmaze.com/episodes/${episodeId}`, { next: { revalidate: 3600 } });
  if (!res.ok){
    return <NotFound/>;
  }
  const episode = await res.json();
  return(
    <div>
      {episode.image?.original &&  <Image src={episode.image.original} alt={episode.name} width={300} height={300} priority={true}/>}
      <p>S{episode.season} E{episode.number} - {episode.name}</p>
      <p className="text-sm flex items-end gap-1">
        {episode.rating?.average && <Star/>} 
        {episode.rating?.average ? episode.rating.average.toFixed(1) : 'Rating unavailable'}
      </p>
      {episode.summary && episode.summary?.replace(/<[^>]+>/g, "")}
      {episode.airdate && <p>Airdate: {episode.airdate}</p>}
      {episode.runtime && <p>Runtime: {episode.runtime} min</p>}
      <FavoriteButton featureId={episode.id} type="episodes"/>
    </div>
  );
}