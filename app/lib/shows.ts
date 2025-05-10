export function getUniqueShowsFromSchedule(schedule: any[]): any[] {
  const showsMap = new Map<number, any>();
  schedule.forEach((entry: any) => {
    const show = entry._embedded.show;
    showsMap.set(show.id, show); // If show.id already exists, it will be overwritten
  });
  return Array.from(showsMap.values());
}

export function sortShowsByRating(shows: any[]): any[] {
  return shows.slice().sort((a, b) => {
    //ako postoji rating, vrijednost će biti rating, a inače će biti 0
    const ratingA = a.rating?.average ?? 0;
    const ratingB = b.rating?.average ?? 0;
    return ratingB - ratingA; // Descending order
  });
}
