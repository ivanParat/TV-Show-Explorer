import Link from "next/link";
import FavoriteButton from "@/app/components/FavoriteButton";
import NotFound from "@/app/not-found";

export default async function CastPage({params}:{params:{showId: string;}}){
  const { showId } = await params;
  const res = await fetch(`https://api.tvmaze.com/shows/${showId}/cast`, { next: { revalidate: 3600 } });
  if (!res.ok){
    return <NotFound/>;
  }
  const cast = await res.json();
  console.log(cast);

  return(
    <div>
      <table>
        <thead>
          <tr>
            <th>Actor</th>
            <th>Character</th>
          </tr>
        </thead>
        <tbody>
          {cast.map((castMember: any, index: number) => (
            <tr key={index}>
              <td>
                <Link href={`/person/${castMember.person.id}`} className="cursor-pointer">
                  {castMember.person.name}
                </Link>
                <FavoriteButton featureId={castMember.person.id} type="people"/>
              </td>
              <td>
                {castMember.character.name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}