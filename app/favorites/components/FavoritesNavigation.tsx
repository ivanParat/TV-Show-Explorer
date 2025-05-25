//omogućuje navigaciju između favorite serija, favorite glumaca i favorite epizoda

'use client'
 
import { usePathname } from 'next/navigation'
import Link from "next/link";

const types = ["shows", "episodes", "people"];

export default function FavoritesNavigation(){
  const pathname = usePathname(); 
  return (
    <div className="flex space-x-6 text-lg font-medium justify-center py-3">
      {types.map((type:string, index: number) => (
        <Link 
          key={index} 
          href={`/favorites/${type}`} 
          className={`${pathname.includes(type) ? "text-gray-300" : "hover:text-gray-300"} active:text-gray-300`}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Link>
      ))}
    </div>
  );
}