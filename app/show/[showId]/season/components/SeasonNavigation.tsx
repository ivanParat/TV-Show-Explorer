import Link from "next/link";

export default function SeasonNavigation({seasons, showId}: {seasons: any, showId: string}){
  return (
    <div className="flex space-x-2">
      {seasons.map((season:any, index: number) => (
        //prva sezona ima drukčiju putanju jer bismo htjeli da kad korisnik ide pogledati sve epizode da se odmah prikažu epizode prve sezone, ali broj prve sezone nije uvijek 1 - npr. u seriji EastEnders, broj prve sezone je 1985, pa zato trebamo imati različite stranice, jer ne znamo uvijek broj prve sezone da možemo jednostavno proslijediti korisnika na stranicu /show/${showId}/season/1
        <Link key={season.id} href={index === 0 ? `/show/${showId}/season` : `/show/${showId}/season/${season.id}`}>
          <button className="cursor-pointer">{season.number}</button>
        </Link>
      ))}
    </div>
  );
}