export interface Episode {
  id: number;
  name: string;
  season: number;
  number: number;
  airdate?: string;
  runtime?: number;
  summary?: string;
  image?: {
    medium?: string;
    original?: string;
  };
  _links?: {
    self?: { href: string };
    show?: { href: string; name?: string };
  };
  rating?: {
    average?: number;
  };
}

export interface Season {
  id: number;
  number: number;
  premiereDate?: string;
  endDate?: string;
  episodeOrder?: number;
  image?: {
    medium?: string;
    original?: string;
  };
  summary?: string;
}

export interface Show {
  id: number;
  name: string;
  genres?: string[];
  language?: string;
  premiered?: string;
  ended?: string;
  status?: string;
  averageRuntime?: number;
  summary?: string;
  image?: {
    medium?: string;
    original?: string;
  };
  rating?: {
    average?: number;
  };
}

export interface Person {
  id: number;
  name: string;
  birthday?: string;
  deathday?: string;
  country?: {
    name: string;
  };
  gender?: string;
  image?: {
    medium?: string;
    original?: string;
  };
}

export interface CastMember {
  person: Person;
  character: {
    id: number;
    name: string;
  };
}

export interface CastCredit {
  self?: boolean;
  voice?: boolean;
  _links: {
    show:{
      href: string;
      name: string;
    }
    character:{
      href?: string;
      name: string;
    }
  }
}