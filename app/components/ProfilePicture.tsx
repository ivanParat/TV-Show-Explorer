import Image from "next/image";

export default function ProfilePicture({src, name, onClick}: {src: string, name: string, onClick: () => void}){
  return(
    <button className="relative w-8 h-8 overflow-hidden rounded-full cursor-pointer" onClick={() => onClick()} aria-label="Clickable profile picture">
      <Image
        src={src}
        alt={name}
        fill
        className="object-cover transition duration-200 hover:brightness-110 active:brightness-120"
      />
    </button>    
  );
}