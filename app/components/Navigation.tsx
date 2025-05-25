//navbar - sadrži search bar, link na home page, link na favorites page (ako je korisnik logiran), tipku za logiranje ako korisnik nije logiran, odnosno profilnu sliku ako je logiran (+ dropdown gdje se može odjaviti)
//na mobilnoj verziji se search bar otvara tek kad se pritisne search ikona, a linkovi na stranice tek kada se pritisne hamburger

"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { useSession } from 'next-auth/react';
import SignInButton from "./SignInButton";
import SignOutButton from "./SignOutButton";
import { Suspense } from 'react'
import LoadingButton from "./LoadingButton";
import { useClickOutside } from "../hooks/useClickOutside";
import ProfilePicture from "./ProfilePicture";
import { syncAndSignOut } from "../lib/auth";
import SearchBar from "./SearchBar";
import Hamburger from "./Hamburger";

export function Navigation() {
  const session = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileClicked, setIsProfileClicked] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleProfile = () => setIsProfileClicked(!isProfileClicked);
  const closeProfile = () => setIsProfileClicked(false);

  useClickOutside(navRef, closeMenu); //kad kliknemo bilo gdje izvan navbara, zatvori se dropdown menu na mobilnoj verziji
  useClickOutside(navRef, closeProfile); //kad kliknemo bilo gdje izvan navbara, zatvori se dropdown koji se pojavi kad se klikne na profilnu sliku

  return (
    <nav className="flex h-14 items-center justify-between px-2 sm:px-4 lg:px-8 xl:px-12 relative" ref={navRef}>
      <div>
        <Suspense>
          <SearchBar/>
        </Suspense>
      </div>

      {/*hidden on mobile*/}
      <ul className="hidden sm:flex justify-center items-center">
        <li>
          <Link 
            href={"/"}
            className="font-bold hover:text-brand-hover active:text-brand-hover px-5 py-1 sm:px-1 lg:px-3 xl:px-5"
          >
            Home
          </Link>
        </li>
        {
          session?.status == "authenticated" &&
          <li>
          <Link 
            href={"/favorites/shows"}
            className="font-bold hover:text-brand-hover active:text-brand-hover px-5 py-1 sm:px-1 lg:px-3 xl:px-5"
          >
            Favorites
          </Link>
          </li>
        }

        {
          session?.status == "loading" ? 
          <LoadingButton/> : 
          session?.status == "authenticated" && session.data?.user?.id && session.data?.user?.image && session.data?.user?.name ? 
          <>
            <ProfilePicture src={session.data.user.image} name={session.data.user.name} onClick={toggleProfile}/>
            <ul
              className={
                `flex flex-col absolute top-full right-3 items-center w-1/2 sm:w-1/10 py-6 space-y-6 text-sm sm:text-md text-white z-10 bg-card
                ${ !isProfileClicked ? "hidden" : ""}`
              }
            >
              <li className="font-semibold">{session.data.user.name}</li>
              <li>    
                <button 
                  onClick={() => syncAndSignOut(session.data?.user?.id)}
                  className="font-bold
                  bg-brand text-white px-6 py-1 rounded-md hover:bg-brand-hover active:bg-brand-hover 
                  cursor-pointer
                  h-[32px] w-[110px]
                  flex justify-center items-center"  
                  aria-label="Sign Out"
                >
                  Sign Out
                </button>
              </li>
            </ul>
          </> :
          session?.status == "authenticated" && session.data?.user?.id ?
          <SignOutButton userId={session.data.user.id}/> : 
          <SignInButton/>
        }

      </ul>

      {/*visible on mobile*/}
      <ul className="flex sm:hidden justify-center items-center">
        <Hamburger isOpen={isMenuOpen} toggleMenu={toggleMenu} />
        <ul
          className={
            `flex sm:hidden flex-col absolute top-full right-3 items-center w-1/2 py-6 space-y-6 text-sm text-white z-10 bg-card
            ${ !isMenuOpen ? "hidden" : ""}`
          }
        >
          <li>
            <Link 
              href={"/"}
              className="font-bold hover:text-brand-hover active:text-brand-hover px-5 py-1 sm:px-1 lg:px-3 xl:px-5"
              onClick={closeMenu}
            >
              Home
            </Link>
          </li>
          {
            session?.status == "authenticated" &&
            <li>
            <Link 
              href={"/favorites/shows"}
              className="font-bold hover:text-brand-hover active:text-brand-hover px-5 py-1 sm:px-1 lg:px-3 xl:px-5"
              onClick={closeMenu}
            >
              Favorites
            </Link>
            </li>
          }

          {session?.status == "loading" && <LoadingButton/>} 
          {session?.status == "unauthenticated" && <SignInButton/>}

        </ul>
        {
          session?.status == "authenticated" && session.data?.user?.id && session.data?.user?.image && session.data?.user?.name && 
          <>
            <ProfilePicture src={session.data.user.image} name={session.data.user.name} onClick={toggleProfile}/>
            <ul
              className={
                `flex flex-col absolute top-full right-3 items-center w-1/2 sm:w-1/10 py-6 space-y-6 text-sm sm:text-md text-white z-10 bg-card
                ${ !isProfileClicked ? "hidden" : ""}`
              }
            >
              <li className="font-semibold">{session.data.user.name}</li>
              <li>    
                <button 
                  onClick={() => syncAndSignOut(session.data?.user?.id)}
                  className="font-bold
                  bg-brand text-white px-6 py-1 rounded-md hover:bg-brand-hover active:bg-brand-hover 
                  cursor-pointer
                  h-[32px] w-[110px]
                  flex justify-center items-center"  
                  aria-label="Sign Out"
                >
                  Sign Out
                </button>
              </li>
            </ul>
          </> 
        }
      </ul>
    </nav>
  );
}