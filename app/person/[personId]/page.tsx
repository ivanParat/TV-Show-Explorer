import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "@/app/components/FavoriteButton";
import NotFound from "@/app/not-found";

export default async function PersonPage({params}:{params:{personId: string;}}){
  const { personId } = await params;
  const res = await fetch(`https://api.tvmaze.com/people/${personId}?embed=castcredits`, { next: { revalidate: 3600 } });
  if (!res.ok){
    return <NotFound/>;
  }
  const person = await res.json();
  console.log(person);

  return(
    <div>
      {person.image?.original && <Image src={person.image.original} alt={person.name} width={210} height={295} priority={true}/>}
      <p>{person.name}</p>
      {person.birthday && <p>Date of birth: {person.birthday}</p>}
      {person.deathday && <p>Date of death: {person.deathday}</p>}
      {person.country?.name && <p>Country: {person.country.name}</p>}
      {person.gender && <p>Gender: {person.gender}</p>}
      <FavoriteButton featureId={person.id} type="people"/>
      {
        person._embedded?.castcredits &&
        (
          <div>
            <p>Cast Credits</p>
            <table>
              <thead>
                <tr>
                  <th>Show</th>
                  <th>Character</th>
                </tr>
              </thead>
              <tbody>
                {person._embedded.castcredits.map((credit:any, index: number) => (
                  <tr key={index}>
                    <td>
                      {
                        credit._links?.show && 
                        <div>
                          <Link href={`/show/${credit._links.show.href.split("/").pop()}`}>
                            {credit._links.show.name}
                          </Link>
                          <FavoriteButton featureId={credit._links.show.href.split("/").pop()} type="shows"/>
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
    </div>
  );
}