import Link from "next/link";

export default function EpisodeList({episodes, showId}: {episodes: any, showId: string}){
  return (
    <div>
      {episodes.map((episode:any) => (
        <Link key={episode.id} href={`/show/${showId}/episode/${episode.id}`}>
          <p>S{episode.season} E{episode.number} - {episode.name}</p>
        </Link>
      ))}
    </div>
  );
}