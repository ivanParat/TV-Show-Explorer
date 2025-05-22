import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "@/app/components/FavoriteButton";
import { Person } from "@/app/types/types";

export default function PersonCard({person}: {person: Person}) {
  return(
    <div className="bg-card text-white rounded-xl transition duration-200 hover:brightness-110 active:brightness-120">
      <Link href={`/person/${person.id}`} className="flex flex-col h-full">
        <div className="h-full flex flex-col">
          {person.image?.original && (
            <div className="relative w-full aspect-[8/10] overflow-hidden rounded-t-xl">
              <Image
                src={person.image.original}
                alt={person.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="px-3 pb-4 pt-2 flex justify-between grow">
            <h2 className="text-md font-medium mt-2">{person.name}</h2>
            <div className="flex flex-col justify-end">
              <FavoriteButton featureId={person.id} type={'people'}/>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}