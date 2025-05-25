//služi za pružanje funkcije setFavorites favorites stranicama, koristi se jer tu funkciju treba komponenta FavoriteButton, koja može bit duboko nested, pa da ne šaljemo props preduboko

import { createContext, Dispatch, SetStateAction } from "react";

export const FavoritesContext = createContext<Dispatch<SetStateAction<any[]>> | null>(null);