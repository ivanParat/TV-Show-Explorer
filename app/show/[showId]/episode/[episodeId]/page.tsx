import Image from "next/image";
import Link from "next/link";
import Star from "@/app/components/Star";
import FavoriteButton from "@/app/components/FavoriteButton";
import NotFound from "@/app/not-found";

export async function generateMetadata({params}:{params:Promise<{showId: string; episodeId: string}>}){
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

export default async function EpisodePage({params}:{params:Promise<{showId: string; episodeId: string}>}){
  const { showId, episodeId } = await params;
  const res = await fetch(`https://api.tvmaze.com/episodes/${episodeId}`, { next: { revalidate: 3600 } });
  if (!res.ok){
    return <NotFound/>;
  }
  const episode = await res.json();
  const showName = episode._links?.show?.name;
  return(
    <main className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 px-8 sm:px-0 pt-16 sm:pt-20 mb-8 sm:pb-0 sm:space-x-8 justify-center items-center sm:items-start">
      <div className="bg-card rounded-xl">
        {episode.image?.original && <Image src={episode.image.original} alt={episode.name} width={450} height={500} priority={true} className="rounded-t-xl"/>}
        <div className="px-3 pb-4 pt-2 flex flex-col justify-between grow">
          <h2 className="text-lg font-medium mt-2"><Link href={`/show/${showId}`} className="hover:text-accent active:text-accent">{showName}</Link> S{episode.season} E{episode.number}</h2>
          <h2 className="text-lg font-regular">{episode.name}</h2>
          <div className="flex justify-between">
            <p className="text-sm flex items-end gap-1">
              {episode.rating?.average ? <Star/> : <Star unknown={true}/>} 
              {episode.rating?.average ? episode.rating.average.toFixed(1) : '?'}
            </p>
            <FavoriteButton featureId={episode.id} type={'episodes'}/>
          </div>
        </div>
      </div>
      <div className="space-y-2 sm:text-lg sm:w-1/3 bg-card rounded-xl px-4 py-6">
        {episode.summary && <p><span className="font-semibold">Summary: </span><span>{episode.summary?.replace(/<[^>]+>/g, "")}</span></p>}
        {episode.airdate && <p><span className="font-semibold">Airdate: </span><span>{episode.airdate}</span></p>}
        {episode.runtime && <p><span className="font-semibold">Runtime: </span><span>{episode.runtime} min</span></p>}
      </div>
    </main>
  );
}