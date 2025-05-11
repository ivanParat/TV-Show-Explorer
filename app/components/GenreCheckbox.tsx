import { Dispatch, SetStateAction } from "react";

const GENRES = [
  "Action", "Adult", "Adventure", "Anime", "Children", "Comedy", "Crime", "DIY",
  "Drama", "Espionage", "Family", "Fantasy", "Food", "History", "Horror", "Legal",
  "Medical", "Music", "Mystery", "Nature", "Romance", "Science-Fiction", "Sports",
  "Supernatural", "Thriller", "Travel", "War", "Western"
];

export default function GenreCheckbox({selectedGenres, setSelectedGenres}: {selectedGenres: string[], setSelectedGenres: Dispatch<SetStateAction<string[]>>}){
  const handleGenreChange = (genre: string) => {
    setSelectedGenres((prev: string[]) =>
      prev.includes(genre)
        //ako je već u listi odabranih žanrova, mičemo ga
        ? prev.filter(g => g !== genre)
        //ako nije, dodajemo ga
        : [...prev, genre]
    );
  };
  
  return (
    <div className="p-4">
      <h2 className="font-bold mb-2">Filter by Genre</h2>
      <div className="flex flex-wrap gap-2 max-w-4xl">
        {GENRES.map(genre => (
          <label key={genre} className="flex items-center space-x-1 text-sm">
            <input
              type="checkbox"
              value={genre}
              checked={selectedGenres.includes(genre)}
              onChange={() => handleGenreChange(genre)}
            />
            <span>{genre}</span>
          </label>
        ))}
      </div>
    </div>
  );
}