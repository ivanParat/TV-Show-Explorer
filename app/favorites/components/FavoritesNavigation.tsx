import Link from "next/link";

const types = ["shows", "episodes", "people"];

export default function FavoritesNavigation(){
  return (
    <div className="flex space-x-2">
      {types.map((type:string, index: number) => (
        <Link key={index} href={`/favorites/${type}`}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Link>
      ))}
    </div>
  );
}