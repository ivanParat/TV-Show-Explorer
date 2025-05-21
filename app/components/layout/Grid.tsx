export default function Grid({ children }: { children: React.ReactNode }){
  return(
    <div className="
      grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 
      gap-4 lg:gap-6 
      py-6 
      px-4 sm:px-8 md:px-12 lg:px-20"
    >
      {children}
    </div>
  );
}