export default function NavButton({ children, onClick }: { children: React.ReactNode, onClick?: Function }){
  return (
    <button 
      onClick={onClick ? () => onClick() : undefined}
      className="font-bold
      bg-brand text-white px-6 py-1 rounded-md hover:bg-brand-hover active:bg-brand-hover 
      cursor-pointer
      h-[32px] w-[110px]
      md:ml-1 lg:ml-3 xl:ml-5
      flex justify-center items-center"  
    > 
      {children}
    </button>
  );
}