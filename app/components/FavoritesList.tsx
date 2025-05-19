"use client"

import ShowCard from "./ShowCard";
import { useState } from "react";
import GenreCheckbox from "./GenreCheckbox";
import Image from "next/image";
import FavoriteButton from "./FavoriteButton";
import Star from "./Star";

export default function FavoritesList({favorites, type}: {favorites: any[], type: string}) {
  if(type === "shows"){
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

    const filteredShows = selectedGenres.length === 0
    ? favorites
    : favorites.filter(show =>
        show.genres?.some((genre: string) => selectedGenres.includes(genre))
      );

    return(
      <div>
        <GenreCheckbox selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres}/>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
        {filteredShows.map((show: any) => (
          <ShowCard key={show.id} show={show}/>
        ))}
        </div>
      </div>
    );
  }
  if(type === "episodes"){
    return(
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
        {favorites.map((episode: any) => (
          <div key={episode.id}>
            {episode.image?.original &&  <Image src={episode.image.original} alt={episode.name} width={300} height={300} priority={true}/>}
            <p>S{episode.season} E{episode.number} - {episode.name}</p>
            <p className="text-sm flex items-end gap-1">
              {episode.rating?.average && <Star/>} 
              {episode.rating?.average ? episode.rating.average.toFixed(1) : 'Rating unavailable'}
            </p>
            {episode.summary && episode.summary?.replace(/<[^>]+>/g, "")}
            {episode.airdate && <p>Airdate: {episode.airdate}</p>}
            {episode.runtime && <p>Runtime: {episode.runtime} min</p>}
            <FavoriteButton featureId={episode.id} type="episodes"/>
          </div>
        ))}
      </div>
    );
  }
  if(type === "people"){
    return(
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
        {favorites.map((person: any) => (
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
}