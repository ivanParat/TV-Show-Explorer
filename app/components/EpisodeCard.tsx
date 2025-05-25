import Image from "next/image";
import Link from "next/link";
import Star from "@/app/components/Star";
import FavoriteButton from "@/app/components/FavoriteButton";
import { Episode } from "@/app/types/types";

export default function EpisodeCard({episode, showNameIncluded}: {episode: Episode, showNameIncluded?: boolean}) { //showNameIncluded naznačuje trebamo li prikazati i ime serije. Na stranici s favoritima trebamo, da se zna kojoj seriji pripada koja epizoda, a na stranici sezone ne trebamo, jer znamo da sve epizode pripadaju istoj seriji
  const showId = episode._links?.show?.href.split("/").pop();
  const showName = showNameIncluded ? episode._links?.show?.name : undefined;
  return(
    <div className="bg-card text-white rounded-xl transition duration-200 hover:brightness-110 active:brightness-120">
      <Link href={`/show/${showId}/episode/${episode.id}`} className="flex flex-col h-full">
        <div className="h-full flex flex-col">
          {episode.image?.original && (
            <div className="relative w-full aspect-[3/2] overflow-hidden rounded-t-xl">
              <Image
                src={episode.image.original}
                alt={episode.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="px-3 pb-4 pt-2 flex flex-col justify-between grow">
            {
              showNameIncluded ? 
              <h2 className="text-md font-medium mt-2">{showName} S{episode.season} E{episode.number}</h2> :
              <h2 className="text-md font-medium mt-2">S{episode.season} E{episode.number}</h2>
            }
            <h2 className="text-md font-regular">{episode.name}</h2>
            <div className="flex justify-between">
              <p className="text-sm flex items-end gap-1">
                {episode.rating?.average ? <Star/> : <Star unknown={true}/>} 
                {episode.rating?.average ? episode.rating.average.toFixed(1) : '?'}
              </p>
              <FavoriteButton featureId={episode.id} type={'episodes'}/>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}