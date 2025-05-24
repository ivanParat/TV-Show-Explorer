"use client"

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar(){
  const router = useRouter();
  const searchParams = useSearchParams();
  const [input, setInput] = useState(searchParams.get("q") || "");
  const handleSearch = () => {
    if (!input.trim()) return; // Do nothing if input is empty or just spaces
    router.push(`/search?q=${encodeURIComponent(input)}`);
  };

  useEffect(() => {
    if (!searchParams.get("q")) {
      setInput("");
    }
  }, [searchParams]);

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      {/* Hidden on mobile */}
      <div className="hidden sm:flex items-center bg-gray-dark rounded-lg px-2 py-1 sm:w-60 lg:w-80 xl:w-100">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-2 outline-none text-main-text bg-gray-dark"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button 
          className="ml-2 text-main-text hover:text-brand-hover cursor-pointer"
          onClick={handleSearch}
          aria-label="Search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Visible on mobile */}
      <div className="sm:hidden flex justify-center pl-3">
        {isSearchOpen ? (
          <div className="flex items-center bg-gray-dark rounded-lg px-2 h-[32px] w-full">
            <button onClick={() => { setIsSearchOpen(false);}} className="ml-2 text-white hover:text-brand-hover">
              ✖️
            </button>
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-2 outline-none text-main-text bg-gray-dark"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className="ml-2  hover:text-brand-hover" onClick={() => { setIsSearchOpen(false); handleSearch()}} aria-label="Search">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
          </div>
        ) : (
          <button className="ml-2  hover:text-brand-hover" onClick={() => { setIsSearchOpen(true);}} aria-label="Open search bar">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
        )}
      </div>
    </>
  )
}