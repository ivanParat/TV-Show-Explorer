//stranica prikazuje glumce i njihove likove neke serije

import Link from "next/link";
import Image from "next/image";
import FavoriteButton from "@/app/components/FavoriteButton";
import NotFound from "@/app/not-found";
import { CastMember } from "@/app/types/types";

export async function generateMetadata({params}:{params:Promise<{showId: string;}>}){
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

export default async function CastPage({params}:{params:Promise<{showId: string;}>}){
  const { showId } = await params;
  const res = await fetch(`https://api.tvmaze.com/shows/${showId}/cast`, { next: { revalidate: 3600 } });
  if (!res.ok){
    return <NotFound/>;
  }
  const cast = await res.json();

  const resShow = await fetch(`https://api.tvmaze.com/shows/${showId}`, { next: { revalidate: 3600 } });
  if (!resShow.ok){
    return <NotFound/>
  };
  const show = await resShow.json();

  return(
    <main className="flex flex-col items-center pb-8 px-4">
      <div className="flex text-lg sm:text-xl font-medium justify-center pt-3 pb-5">
        <span className="whitespace-nowrap">
          <Link href={`/show/${showId}`}>
            <button className="cursor-pointer hover:text-accent active:text-accent" aria-label="View show">{show.name}</button>
          </Link>
          <span>&nbsp;Cast</span>
        </span>
      </div>
      <div className="bg-card px-2 sm:px-16 py-6 rounded-xl">
        <table>
          <thead>
            <tr className="font-semibold text-left text-md sm:text-lg">
              <th>Actor</th>
              <th className="pl-0 sm:pl-18">Character</th>
            </tr>
          </thead>
          <tbody className="sm:text-lg">
            {cast.map((castMember: CastMember, index: number) => (
              <tr key={index}>
                <td>
                  {castMember.person?.image?.medium && 
                  <Link href={`/person/${castMember.person.id}`}>
                    <Image src={castMember.person.image.medium} alt={castMember.person.name} width={120} height={100} className="mt-5 rounded-md transition duration-200 hover:brightness-110 active:brightness-120"/>
                  </Link>}
                  <div className="mt-1 flex items-end gap-2">
                    <Link href={`/person/${castMember.person.id}`} className="cursor-pointer hover:text-accent active:text-accent">
                      {castMember.person.name}
                    </Link>
                    <FavoriteButton featureId={castMember.person.id} type="people"/>
                  </div>
                </td>
                <td className="pl-0 sm:pl-18">
                  {castMember.character?.image?.medium && <Image src={castMember.character.image.medium} alt={castMember.person.name} width={120} height={100} className="rounded-md mt-5"/>}                
                  <p className="mt-1">{castMember.character.name}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}