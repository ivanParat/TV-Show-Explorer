"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function SearchBar(){
  const router = useRouter();
  const searchParams = useSearchParams();
  const [input, setInput] = useState(searchParams.get("q") || "");
  const handleSearch = () => {
    router.push(input ? `/search?q=${encodeURIComponent(input)}` : "/");
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
      <div className="hidden md:flex items-center bg-gray-dark rounded-lg px-2 py-1 md:w-32 lg:w-60 xl:w-80">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-2 outline-none text-main-text bg-gray-dark"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button 
          className="ml-2 text-main-text hover:text-brand"
          onClick={handleSearch}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Visible on mobile */}
      <div className="md:hidden flex justify-center pl-3">
        {isSearchOpen ? (
          <div className="flex items-center bg-gray-dark rounded-lg px-2 w-full">
            <button onClick={() => { setIsSearchOpen(false);}} className="ml-2 text-white hover:text-brand">
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
            <button className="ml-2  hover:text-brand" onClick={() => { setIsSearchOpen(false); handleSearch()}}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
          </div>
        ) : (
          <button className="ml-2  hover:text-brand" onClick={() => { setIsSearchOpen(true);}}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
        )}
      </div>
    </>
  )
}

export function Navigation() {

  return (
    <nav className="flex h-14 items-center justify-between px-2 md:px-4 lg:px-8 xl:px-12">
      <div>
        <SearchBar/>
      </div>
      <ul className="flex justify-center items-center">
        <Link 
          href={"/favorites"}
          className="font-bold hover:text-brand active:text-brand px-5 py-1 md:px-1 lg:px-3 xl:px-5"
        >
          Favorites
        </Link>

        <Link
          href={"/login"}
          className="font-bold md:ml-1 lg:ml-3 xl:ml-5"
        >
          <button className="bg-brand text-white px-6 py-1 rounded-md hover:bg-brand-hover active:bg-brand-hover cursor-pointer">
            Log in
          </button>
        </Link>
      </ul>
    </nav>
  );
}