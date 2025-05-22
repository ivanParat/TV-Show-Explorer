import { Episode } from "@/app/types/types";
import EpisodeCard from "./EpisodeCard";
import Grid from "@/app/components/layout/Grid";

export default function FavoriteEpisodesList({favorites}: {favorites: Episode[]}) {
  return(
    <main className="flex flex-col">
      <Grid>
      {favorites.map((episode: Episode) => (
        <EpisodeCard key={episode.id} episode={episode}/>
      ))}
      </Grid>
    </main>
  );
}
