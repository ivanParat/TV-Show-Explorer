import Image from "next/image";
import Link from "next/link";
import Star from "./Star";
import FavoriteButton from "./FavoriteButton";
import { Show } from "../types/types";

export default function ShowCard({show}: {show: Show}) {
  return(
    <div>
      <Link href={`/show/${show.id}`}>
        <div className="bg-gray-800 text-white p-4 rounded">
          {show.image?.original && (
            <Image src={show.image.original} alt={show.name} width={210} height={295} />
          )}
          <h2 className="text-xl mt-2">{show.name}</h2>
          <p className="text-sm flex items-end gap-1">
            {show.rating?.average && <Star/>} 
            {show.rating?.average ? show.rating.average.toFixed(1) : 'Rating unavailable'}
          </p>
        </div>
      </Link>
      <FavoriteButton featureId={show.id} type={'shows'}/>
    </div>
  );
}