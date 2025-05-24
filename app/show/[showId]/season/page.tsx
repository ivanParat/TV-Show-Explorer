import SeasonNavigation from "./components/SeasonNavigation";
import EpisodeList from "./components/EpisodeList";
import NotFound from "@/app/not-found";

export async function generateMetadata({params}:{params:Promise<{showId: string;}>}){
  const { showId } = await params;

  const res = await fetch(`https://api.tvmaze.com/shows/${showId}`, { next: { revalidate: 3600 } });
  if (!res.ok) return { title: "Show does not exist" };
  const show = await res.json();

  const resSeasons = await fetch(`https://api.tvmaze.com/shows/${showId}/seasons`, { next: { revalidate: 3600 } });
  if (!resSeasons.ok) return { title: "Seasons do not exist" };
  const seasons = await resSeasons.json();

  const image = show.image?.original || "/fallback-image.png";
  const summaryText = show.summary?.replace(/<[^>]+>/g, "") || "No summary available";

  return {
    title: `TV Show Explorer | ${show.name} | Season ${seasons[0].number}`,
    description: `${show.name} - ${summaryText}`,
    keywords: ["TV", "Show", "Television", "Series", "Season", "Episode", "Cast", "Actor", "Character"],
    openGraph: {
      images: [{ url: image, width: 210, height: 295 }],
    },
  };
}

export default async function SeasonPage({params}:{params:Promise<{showId: string;}>}){
  const { showId } = await params;
  const resSeasons = await fetch(`https://api.tvmaze.com/shows/${showId}/seasons`, { next: { revalidate: 3600 } });
  if (!resSeasons.ok){
    return <NotFound/>;
  }
  const seasons = await resSeasons.json();

  const firstSeason = seasons[0];
  const resFirstSeasonEpisodes = await fetch(`https://api.tvmaze.com/seasons/${firstSeason.id}/episodes`, { next: { revalidate: 3600 } });
  if (!resFirstSeasonEpisodes.ok){
    return <NotFound/>;
  }
  const episodes = await resFirstSeasonEpisodes.json();

  const resShow = await fetch(`https://api.tvmaze.com/shows/${showId}`, { next: { revalidate: 3600 } });
  if (!resShow.ok){
    return <NotFound/>;
  }
  const show = await resShow.json();

  return(
    <div>
      <SeasonNavigation seasons={seasons} showId={showId} showName={show.name}/>
      <EpisodeList episodes={episodes}/>
    </div>
  );
}