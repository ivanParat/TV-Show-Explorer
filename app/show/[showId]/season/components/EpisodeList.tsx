import Link from "next/link";
import FavoriteButton from "@/app/components/FavoriteButton";

export default function EpisodeList({episodes, showId}: {episodes: any, showId: string}){
  return (
    <div>
      {episodes.map((episode:any) => (
        <div key={episode.id}>
          <Link href={`/show/${showId}/episode/${episode.id}`}>
            <p>S{episode.season} E{episode.number} - {episode.name}</p>
          </Link>
          <FavoriteButton featureId={episode.id} type={'episodes'}/>
        </div>
      ))}
    </div>
  );
}