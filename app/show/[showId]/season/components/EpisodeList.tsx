import Link from "next/link";
import FavoriteButton from "@/app/components/FavoriteButton";
import { Episode } from "@/app/types/types";

export default function EpisodeList({episodes, showId}: {episodes: Episode[], showId: string}){
  return (
    <div>
      {episodes.map((episode: Episode) => (
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