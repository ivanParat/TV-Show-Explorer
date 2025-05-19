import { createContext, Dispatch, SetStateAction } from "react";

export const FavoritesContext = createContext<Dispatch<SetStateAction<any[]>> | null>(null);