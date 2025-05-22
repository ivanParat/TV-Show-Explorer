import { Person } from "@/app/types/types";
import PersonCard from "./PersonCard";
import Grid from "@/app/components/layout/Grid";

export default function FavoritePeopleList({favorites}: {favorites: Person[]}) {
  return(
    <main className="flex flex-col">
      <Grid>
      {favorites.map((person: Person) => (
        <PersonCard key={person.id} person={person}/>
      ))}
      </Grid>
    </main>
  );
}
