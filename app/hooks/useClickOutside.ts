import { useEffect } from "react";

export function useClickOutside(ref: React.RefObject<HTMLElement> | null, callback: () => void) {
  if(ref)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback(); //funkcija se poziva ako je kliknuto bilo gdje izvan ref-a
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ref, callback]);
}