"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Season } from "@/app/types/types";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; 

export default function SeasonNavigation({seasons, showId, showName}: {seasons: Season[], showId: string, showName: string}){
  const pathname = usePathname();
  const match = pathname.match(/\/show\/\d+\/season\/(\d+)/);
  const selectedSeasonId = match ? Number(match[1]) : seasons[0].id;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 0);
    setShowRightArrow(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollButtons(); 
    el.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth - 100;
      scrollRef.current.scrollBy({ 
        left: direction === "left" ? -scrollAmount : scrollAmount, 
        behavior: "smooth" 
      });
    }
  };
  return (
    <div className="flex flex-col">
      <div className="flex text-lg font-medium justify-center">
        <span className="whitespace-nowrap">
          <Link href={`/show/${showId}`}>
            <button className="cursor-pointer hover:text-accent active:text-accent" aria-label="View show">
              {showName}
            </button>
          </Link>
          <span>&nbsp;Seasons</span>
        </span>
      </div>

      <div className="relative w-full pt-2 pb-2">
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-card px-2 py-1 rounded-l hover:bg-muted"
            aria-label="Scroll through seasons to the left"
          >
            <ChevronLeft />
          </button>
        )}

        <div
          ref={scrollRef}
          className={`flex overflow-x-auto no-scrollbar space-x-6 text-lg font-medium px-10 ${!showLeftArrow && !showRightArrow ? "justify-center" : ""}`}
        >
          {seasons.map((season, index) => (
            <Link
              key={season.id}
              href={
                index === 0
                  ? `/show/${showId}/season`
                  : `/show/${showId}/season/${season.id}`
              }
              className={`${
                selectedSeasonId === season.id
                  ? "text-gray-300"
                  : "hover:text-gray-300 active:text-gray-300"
              }`}
            >
              <button className="cursor-pointer whitespace-nowrap" aria-label={`View episodes of season ${season.number}`}>
                {season.number}
              </button>
            </Link>
          ))}
        </div>

        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-card px-2 py-1 rounded-r hover:bg-muted"
            aria-label="Scroll through seasons to the right"
          >
            <ChevronRight />
          </button>
        )}
      </div>
    </div>
  );
}