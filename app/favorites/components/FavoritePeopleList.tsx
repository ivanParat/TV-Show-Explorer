import Image from "next/image";
import FavoriteButton from "@/app/components/FavoriteButton";
import { Person } from "@/app/types/types";

export default function FavoritePeopleList({favorites}: {favorites: Person[]}) {
  return(
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
      {favorites.map((person: Person) => (
        <div key={person.id}>
          {person.image?.original && <Image src={person.image.original} alt={person.name} width={210} height={295} priority={true}/>}
          <p>{person.name}</p>
          {person.birthday && <p>Date of birth: {person.birthday}</p>}
          {person.deathday && <p>Date of death: {person.deathday}</p>}
          {person.country?.name && <p>Country: {person.country.name}</p>}
          {person.gender && <p>Gender: {person.gender}</p>}
          <FavoriteButton featureId={person.id} type="people"/>
        </div>
      ))}
    </div>
  );
}
