import Image from "next/image";
import Link from "next/link";
import Star from "./Star";
import FavoriteButton from "./FavoriteButton";
import { Show } from "../types/types";

export default function ShowCard({show}: {show: Show}) {
  return(
    <div className="bg-card text-white rounded-xl">
      <Link href={`/show/${show.id}`} className="flex flex-col h-full">
        <div className="h-full flex flex-col">
          {show.image?.original && (
            <div className="relative w-full aspect-[210/295] overflow-hidden rounded-t-xl">
              <Image
                src={show.image.original}
                alt={show.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="px-3 pb-4 pt-2 flex flex-col justify-between grow">
            <h2 className="text-md font-medium mt-2">{show.name}</h2>
            <div className="flex justify-between">
              <p className="text-sm flex items-end gap-1">
                {show.rating?.average ? <Star/> : <Star unknown={true}/>} 
                {show.rating?.average ? show.rating.average.toFixed(1) : '?'}
              </p>
              <FavoriteButton featureId={show.id} type={'shows'}/>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}