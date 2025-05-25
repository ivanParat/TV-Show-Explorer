import Grid from "@/app/components/layout/Grid";
import EpisodeCard from "@/app/components/EpisodeCard";
import { Episode } from "@/app/types/types";

export default function EpisodeList({episodes}: {episodes: Episode[]}){
  return (
    <div className="flex flex-col">
      <Grid>
      {episodes.map((episode: Episode) => (
        <EpisodeCard key={episode.id} episode={episode}/>
      ))}
      </Grid>
    </div>
  );
}