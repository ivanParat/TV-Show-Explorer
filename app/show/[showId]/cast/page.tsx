import Link from "next/link";
import FavoriteButton from "@/app/components/FavoriteButton";
import NotFound from "@/app/not-found";

export async function generateMetadata({params}:{params:{showId: string;}}){
  const { showId } = await params;

  const res = await fetch(`https://api.tvmaze.com/shows/${showId}`, { next: { revalidate: 3600 } });
  if (!res.ok) return { title: "Show does not exist" };
  const show = await res.json();

  const image = show.image?.original || "/fallback-image.png";
  const summaryText = show.summary?.replace(/<[^>]+>/g, "") || "No summary available";

  return {
    title: `TV Show Explorer | ${show.name} | Cast`,
    description: `${show.name} - ${summaryText}`,
    keywords: ["TV", "Show", "Television", "Series", "Season", "Episode", "Cast", "Actor", "Character"],
    openGraph: {
      images: [{ url: image, width: 210, height: 295 }],
    },
  };
}

export default async function CastPage({params}:{params:{showId: string;}}){
  const { showId } = await params;
  const res = await fetch(`https://api.tvmaze.com/shows/${showId}/cast`, { next: { revalidate: 3600 } });
  if (!res.ok){
    return <NotFound/>;
  }
  const cast = await res.json();

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