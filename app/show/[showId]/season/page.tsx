import SeasonNavigation from "./components/SeasonNavigation";
import EpisodeList from "./components/EpisodeList";
import NotFound from "@/app/not-found";

export default async function SeasonPage({params}:{params:{showId: string;}}){
  const { showId } = await params;
  const resSeasons = await fetch(`https://api.tvmaze.com/shows/${showId}/seasons`, { next: { revalidate: 3600 } });
  if (!resSeasons.ok){
    return <NotFound/>;
  }
  const seasons = await resSeasons.json();
  console.log(seasons);

  const firstSeason = seasons[0];
  const resFirstSeasonEpisodes = await fetch(`https://api.tvmaze.com/seasons/${firstSeason.id}/episodes`, { next: { revalidate: 3600 } });
  if (!resFirstSeasonEpisodes.ok){
    return <NotFound/>;
  }
  const episodes = await resFirstSeasonEpisodes.json();
  console.log(episodes)

  return(
    <div>
      <SeasonNavigation seasons={seasons} showId={showId}/>
      <EpisodeList episodes={episodes} showId={showId}/>
    </div>
  );
}