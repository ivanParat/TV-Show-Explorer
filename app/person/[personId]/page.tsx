import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "@/app/components/FavoriteButton";
import NotFound from "@/app/not-found";
import { CastCredit } from "@/app/types/types";

export async function generateMetadata({params}:{params: Promise<{personId: string;}>}){
  const { personId } = await params;
  const res = await fetch(`https://api.tvmaze.com/people/${personId}?embed=castcredits`, { next: { revalidate: 3600 } });
  if (!res.ok) return { title: "Person does not exist" };
  const person = await res.json();
  const image = person.image?.original || "/fallback-image.png";
  return {
    title: `TV Show Explorer | ${person.name}`,
    description: "See personal info about an actor, as well as all their roles",
    keywords: ["TV", "Show", "Television", "Series", "Season", "Episode", "Cast", "Actor", "Character"],
    openGraph: {
      images: [{ url: image, width: 210, height: 295 }],
    },
  };
}

export default async function PersonPage({params}: {params: Promise<{personId: string;}>}){
  const { personId } = await params;
  const res = await fetch(`https://api.tvmaze.com/people/${personId}?embed=castcredits`, { next: { revalidate: 3600 } });
  if (!res.ok){
    return <NotFound/>;
  }
  const person = await res.json();

  return(
    <main className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 px-8 sm:px-0 pt-16 mb-8 sm:pb-0 sm:space-x-8 justify-center items-center sm:items-start">
      <div className="bg-card rounded-xl max-w-[300px]">
        {person.image?.original && <Image src={person.image.original} alt={person.name} width={300} height={500} priority={true} className="rounded-t-xl"/>}
        <div className="px-3 pb-4 pt-2 text-md">
          <h2 className="text-xl font-medium mt-2 mb-2">{person.name}</h2>
          {person.birthday && <p>Date of birth: {person.birthday}</p>}
          {person.deathday && <p>Date of death: {person.deathday}</p>}
          {person.country?.name && <p>Country: {person.country.name}</p>}
          <div className="flex justify-between">
            {person.gender && <p>Gender: {person.gender}</p>}
            <FavoriteButton featureId={person.id} type="people"/>
          </div>
        </div>
      </div>
      {
        person._embedded?.castcredits &&
        (
          <div className="space-y-4 sm:text-lg sm:w-1/3 bg-card rounded-xl px-4 py-6">
            <h2 className="font-medium text-lg sm:text-xl">Cast Credits</h2>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Show</th>
                  <th className="text-left">Character</th>
                </tr>
              </thead>
              <tbody>
                {person._embedded.castcredits.map((credit: CastCredit, index: number) => (
                  <tr key={index}>
                    <td>
                      {
                        credit._links?.show && 
                        <div className="flex items-center mt-1 mr-2">
                          <Link 
                            href={`/show/${credit._links.show.href.split("/").pop()}`}
                            className="hover:text-accent active:text-accent mr-2"
                          >
                            {credit._links.show.name}
                          </Link>
                          <FavoriteButton featureId={Number(credit._links.show.href.split("/").pop())} type="shows"/>
                        </div>
                      }
                    </td>
                    <td>
                      {credit._links?.character && <p>{credit._links.character.name}</p>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
    </main>
  );
}