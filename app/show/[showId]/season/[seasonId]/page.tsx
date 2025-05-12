import SeasonNavigation from "../components/SeasonNavigation";
import EpisodeList from "../components/EpisodeList";
import NotFound from "@/app/not-found";

export async function generateMetadata({params}:{params:{showId: string; seasonId: string}}){
  const { showId, seasonId } = await params;

  const res = await fetch(`https://api.tvmaze.com/shows/${showId}`, { next: { revalidate: 3600 } });
  if (!res.ok) return { title: "Show does not exist" };
  const show = await res.json();

  const resSeasons = await fetch(`https://api.tvmaze.com/shows/${showId}/seasons`, { next: { revalidate: 3600 } });
  if (!resSeasons.ok) return { title: "Seasons do not exist" };
  const seasons = await resSeasons.json();

  const season = seasons.find((s: any) => s.id === Number(seasonId));
  const seasonNumber = season?.number ?? "Unknown";

  const image = show.image?.original || "/fallback-image.png";
  const summaryText = show.summary?.replace(/<[^>]+>/g, "") || "No summary available";

  return {
    title: `TV Show Explorer | ${show.name} | Season ${seasonNumber}`,
    description: `${show.name} - ${summaryText}`,
    keywords: ["TV", "Show", "Television", "Series", "Season", "Episode", "Cast", "Actor", "Character"],
    openGraph: {
      images: [{ url: image, width: 210, height: 295 }],
    },
  };
}

export default async function SeasonPage({params}:{params:{showId: string; seasonId: string}}){
  const { showId, seasonId } = await params;
  const resSeasons = await fetch(`https://api.tvmaze.com/shows/${showId}/seasons`, { next: { revalidate: 3600 } });
  if (!resSeasons.ok){
    return <NotFound/>;
  }
  const seasons = await resSeasons.json();
  console.log(seasons);
  
  const resEpisodes = await fetch(`https://api.tvmaze.com/seasons/${seasonId}/episodes`, { next: { revalidate: 3600 } });
  if (!resEpisodes.ok){
    return <NotFound/>;
  }
  const episodes = await resEpisodes.json();
  console.log(episodes)

  return(
    <div>
      <SeasonNavigation seasons={seasons} showId={showId}/>
      <EpisodeList episodes={episodes} showId={showId}/>
    </div>
  );
}