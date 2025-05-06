import SeasonNavigation from "./components/SeasonNavigation";
import EpisodeList from "./components/EpisodeList";

export default async function SeasonPage({params}:{params:{showId: string;}}){
  const { showId } = await params;
  const resSeasons = await fetch(`https://api.tvmaze.com/shows/${showId}/seasons`, { next: { revalidate: 3600 } });
  const seasons = await resSeasons.json();
  console.log(seasons);

  const firstSeason = seasons[0];
  const resFirstSeasonEpisodes = await fetch(`https://api.tvmaze.com/seasons/${firstSeason.id}/episodes`, { next: { revalidate: 3600 } });
  const episodes = await resFirstSeasonEpisodes.json();
  console.log(episodes)

  return(
    <div>
      <SeasonNavigation seasons={seasons} showId={showId}/>
      <EpisodeList episodes={episodes} showId={showId}/>
    </div>
  );
}