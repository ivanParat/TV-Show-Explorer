"use client"

import Select from "react-select";
import { Dispatch, SetStateAction } from "react";

const GENRES = [
  "Action", "Adult", "Adventure", "Anime", "Children", "Comedy", "Crime", "DIY",
  "Drama", "Espionage", "Family", "Fantasy", "Food", "History", "Horror", "Legal",
  "Medical", "Music", "Mystery", "Nature", "Romance", "Science-Fiction", "Sports",
  "Supernatural", "Thriller", "Travel", "War", "Western"
];

const genreOptions = GENRES.map(genre => ({
  value: genre,
  label: genre
}));

const customStyles = {
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: "#424242", 
    borderRadius: "0.6rem",     
    borderColor: state.isFocused ? "#d1d5db" : "#424242", 
    boxShadow: state.isFocused ? "0 0 0 1px #d1d5db" : "none",
    "&:hover": {
      borderColor: "#d1d5db"
    }
  }),
  multiValue: (base: any) => ({
    ...base,
    backgroundColor: "#ffffff", 
    borderRadius: "0.375rem",
  }),
  multiValueLabel: (base: any) => ({
    ...base,
    color: "#0a0a0a", 
  }),
  multiValueRemove: (base: any) => ({
    ...base,
    color: "#0a0a0a",
    ':hover': {
      backgroundColor: "#d6d6d6",
      color: "#0a0a0a",
    }
  }),
  menuList: (base: any) => ({
    ...base,
    backgroundColor: "#424242",
    padding: 0,
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#858585"   
      : state.isFocused
        ? "#858585" 
        : "#424242", 
    padding: "0.5rem 1rem",
    cursor: "pointer",
  }),
};

export default function GenreSelectDropdown({
  selectedGenres,
  setSelectedGenres
}: {
  selectedGenres: string[],
  setSelectedGenres: Dispatch<SetStateAction<string[]>>
}) {
  const handleChange = (selectedOptions: any) => {
    const genres = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
    setSelectedGenres(genres);
  };

  const selectedOptions = genreOptions.filter(option => selectedGenres.includes(option.value));

  return (
    <div className="px-6 pt-4 max-w-md self-end">
      <Select
        isMulti
        options={genreOptions}
        value={selectedOptions}
        onChange={handleChange}
        placeholder="Filter by Genre..."
        className="text-sm"
        classNamePrefix="react-select"
        styles={customStyles}
      />
    </div>
  );
}