import { Movie, FilterState, Cast } from "../types/movie";

// Fallback high-quality mock data when TMDB API key is not present or invalid
const MOCK_MOVIES: Movie[] = [
  {
    id: 101,
    title: "Inception",
    overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project.",
    posterPath: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=500&auto=format&fit=crop",
    backdropPath: "https://images.unsplash.com/photo-1497011034435-ece36733c4d5?q=80&w=1200&auto=format&fit=crop",
    releaseDate: "2010-07-15",
    rating: 8.4,
    genres: ["Action", "Sci-Fi", "Thriller"],
    runtime: 148,
    trailerUrl: "YoHD9XEInc0", // YouTube ID
    director: "Christopher Nolan",
    cast: [
      { id: 1, name: "Leonardo DiCaprio", character: "Cobb" },
      { id: 2, name: "Joseph Gordon-Levitt", character: "Arthur" },
      { id: 3, name: "Elliot Page", character: "Ariadne" },
      { id: 4, name: "Tom Hardy", character: "Eames" }
    ]
  },
  {
    id: 102,
    title: "The Dark Knight",
    overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    posterPath: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=500&auto=format&fit=crop",
    backdropPath: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    releaseDate: "2008-07-18",
    rating: 9.0,
    genres: ["Action", "Crime", "Drama"],
    runtime: 152,
    trailerUrl: "LDG9bisJEaI",
    director: "Christopher Nolan",
    cast: [
      { id: 5, name: "Christian Bale", character: "Bruce Wayne / Batman" },
      { id: 6, name: "Heath Ledger", character: "Joker" },
      { id: 7, name: "Gary Oldman", character: "Jim Gordon" },
      { id: 8, name: "Aaron Eckhart", character: "Harvey Dent" }
    ]
  },
  {
    id: 103,
    title: "Interstellar",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    posterPath: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=500&auto=format&fit=crop",
    backdropPath: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1200&auto=format&fit=crop",
    releaseDate: "2014-11-05",
    rating: 8.4,
    genres: ["Adventure", "Drama", "Sci-Fi"],
    runtime: 169,
    trailerUrl: "zSWdZVtXT7E",
    director: "Christopher Nolan",
    cast: [
      { id: 9, name: "Matthew McConaughey", character: "Cooper" },
      { id: 10, name: "Anne Hathaway", character: "Brand" },
      { id: 11, name: "Jessica Chastain", character: "Murph" },
      { id: 12, name: "Michael Caine", character: "Professor Brand" }
    ]
  },
  {
    id: 104,
    title: "Dune: Part Two",
    overview: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.",
    posterPath: "https://images.unsplash.com/photo-1547234935-80c7145ec969?q=80&w=500&auto=format&fit=crop",
    backdropPath: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?q=80&w=1200&auto=format&fit=crop",
    releaseDate: "2024-02-27",
    rating: 8.3,
    genres: ["Action", "Adventure", "Sci-Fi"],
    runtime: 166,
    trailerUrl: "Way9Dexny3w",
    director: "Denis Villeneuve",
    cast: [
      { id: 13, name: "Timothée Chalamet", character: "Paul Atreides" },
      { id: 14, name: "Zendaya", character: "Chani" },
      { id: 15, name: "Rebecca Ferguson", character: "Lady Jessica" },
      { id: 16, name: "Austin Butler", character: "Feyd-Rautha Harkonnen" }
    ]
  },
  {
    id: 105,
    title: "Spider-Man: Into the Spider-Verse",
    overview: "Teen Miles Morales becomes the Spider-Man of his universe, and must join with five spider-powered individuals from other dimensions to stop a threat for all realities.",
    posterPath: "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=500&auto=format&fit=crop",
    backdropPath: "https://images.unsplash.com/photo-1608889175123-8ec330b86f84?q=80&w=1200&auto=format&fit=crop",
    releaseDate: "2018-12-06",
    rating: 8.4,
    genres: ["Animation", "Action", "Adventure", "Sci-Fi"],
    runtime: 117,
    trailerUrl: "tg52up16eq0",
    director: "Bob Persichetti",
    cast: [
      { id: 17, name: "Shameik Moore", character: "Miles Morales / Spider-Man" },
      { id: 18, name: "Jake Johnson", character: "Peter B. Parker / Spider-Man" },
      { id: 19, name: "Hailee Steinfeld", character: "Gwen Stacy / Spider-Woman" },
      { id: 20, name: "Mahershala Ali", character: "Uncle Aaron / Prowler" }
    ]
  },
  {
    id: 106,
    title: "Oppenheimer",
    overview: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
    posterPath: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?q=80&w=500&auto=format&fit=crop",
    backdropPath: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1200&auto=format&fit=crop",
    releaseDate: "2023-07-19",
    rating: 8.1,
    genres: ["Drama", "History"],
    runtime: 180,
    trailerUrl: "uYPbbWRjffg",
    director: "Christopher Nolan",
    cast: [
      { id: 21, name: "Cillian Murphy", character: "J. Robert Oppenheimer" },
      { id: 22, name: "Emily Blunt", character: "Kitty Oppenheimer" },
      { id: 23, name: "Matt Damon", character: "Leslie Groves" },
      { id: 24, name: "Robert Downey Jr.", character: "Lewis Strauss" }
    ]
  },
  {
    id: 107,
    title: "Everything Everywhere All at Once",
    overview: "A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes and connecting with the lives she could have led.",
    posterPath: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=500&auto=format&fit=crop",
    backdropPath: "https://images.unsplash.com/photo-1535498730771-e735b998cd64?q=80&w=1200&auto=format&fit=crop",
    releaseDate: "2022-03-24",
    rating: 7.8,
    genres: ["Action", "Adventure", "Comedy", "Sci-Fi", "Fantasy"],
    runtime: 139,
    trailerUrl: "wxN1T1uxQ2g",
    director: "Daniel Kwan",
    cast: [
      { id: 25, name: "Michelle Yeoh", character: "Evelyn Wang" },
      { id: 26, name: "Ke Huy Quan", character: "Waymond Wang" },
      { id: 27, name: "Stephanie Hsu", character: "Joy Wang" },
      { id: 28, name: "Jamie Lee Curtis", character: "Deirdre Beaubeirdre" }
    ]
  },
  {
    id: 108,
    title: "Parasite",
    overview: "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
    posterPath: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?q=80&w=500&auto=format&fit=crop",
    backdropPath: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop",
    releaseDate: "2019-05-30",
    rating: 8.5,
    genres: ["Drama", "Thriller", "Comedy"],
    runtime: 132,
    trailerUrl: "5xH0HfJHsaY",
    director: "Bong Joon Ho",
    cast: [
      { id: 29, name: "Song Kang-ho", character: "Ki-taek" },
      { id: 30, name: "Lee Sun-kyun", character: "Mr. Park" },
      { id: 31, name: "Cho Yeo-jeong", character: "Mrs. Park" },
      { id: 32, name: "Choi Woo-shik", character: "Ki-woo" }
    ]
  },
  {
    id: 109,
    title: "The Matrix",
    overview: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
    posterPath: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=500&auto=format&fit=crop",
    backdropPath: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop",
    releaseDate: "1999-03-30",
    rating: 8.7,
    genres: ["Action", "Sci-Fi"],
    runtime: 136,
    trailerUrl: "m8e-FF8MsqU",
    director: "Lana Wachowski",
    cast: [
      { id: 33, name: "Keanu Reeves", character: "Neo" },
      { id: 34, name: "Laurence Fishburne", character: "Morpheus" },
      { id: 35, name: "Carrie-Anne Moss", character: "Trinity" },
      { id: 36, name: "Hugo Weaving", character: "Agent Smith" }
    ]
  },
  {
    id: 110,
    title: "Spirited Away",
    overview: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.",
    posterPath: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=500&auto=format&fit=crop",
    backdropPath: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1200&auto=format&fit=crop",
    releaseDate: "2001-07-20",
    rating: 8.5,
    genres: ["Animation", "Family", "Fantasy", "Adventure"],
    runtime: 125,
    trailerUrl: "ByXuk9QqQkk",
    director: "Hayao Miyazaki",
    cast: [
      { id: 37, name: "Rumi Hiiragi", character: "Chihiro / Sen (voice)" },
      { id: 38, name: "Miyu Irino", character: "Haku (voice)" },
      { id: 39, name: "Mari Natsuki", character: "Yubaba (voice)" }
    ]
  },
  {
    id: 111,
    title: "Whiplash",
    overview: "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.",
    posterPath: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=500&auto=format&fit=crop",
    backdropPath: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
    releaseDate: "2014-10-10",
    rating: 8.4,
    genres: ["Drama", "Music"],
    runtime: 106,
    trailerUrl: "7d_jQyG8DQY",
    director: "Damien Chazelle",
    cast: [
      { id: 40, name: "Miles Teller", character: "Andrew Neiman" },
      { id: 41, name: "J.K. Simmons", character: "Terence Fletcher" },
      { id: 42, name: "Paul Reiser", character: "Jim Neiman" }
    ]
  },
  {
    id: 112,
    title: "Gladiator",
    overview: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
    posterPath: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=500&auto=format&fit=crop",
    backdropPath: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop",
    releaseDate: "2000-05-01",
    rating: 8.2,
    genres: ["Action", "Adventure", "Drama"],
    runtime: 155,
    trailerUrl: "owK1fQHVA5U",
    director: "Ridley Scott",
    cast: [
      { id: 43, name: "Russell Crowe", character: "Maximus Decimus Meridius" },
      { id: 44, name: "Joaquin Phoenix", character: "Commodus" },
      { id: 45, name: "Connie Nielsen", character: "Lucilla" }
    ]
  }
];

// Helper to extract unique genres from the list
export function getGenres(): string[] {
  const genresSet = new Set<string>();
  MOCK_MOVIES.forEach((movie) => movie.genres.forEach((genre) => genresSet.add(genre)));
  return Array.from(genresSet).sort();
}

interface TmdbMovieResult {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

/**
 * Fetch movies list based on filter state.
 * If tmdbApiKey is valid and provided, we make real requests to TMDB.
 * Otherwise, we search/filter/sort the local MOCK_MOVIES array.
 */
export async function getMovies(filters: FilterState, apiKey?: string): Promise<Movie[]> {
  if (apiKey && apiKey.trim().length > 0) {
    try {
      let url = "";
      if (filters.searchQuery.trim().length > 0) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
          filters.searchQuery
        )}&language=en-US&page=1`;
      } else {
        // If there's no search query, fetch popular movies by default
        url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("TMDB Request failed");
      const data = await res.json();
      
      const rawMovies: TmdbMovieResult[] = data.results || [];
      
      // Fetch genre list to map genre IDs to names
      const genresRes = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`);
      const genreMap: Record<number, string> = {};
      if (genresRes.ok) {
        const genreData = await genresRes.json();
        (genreData.genres || []).forEach((g: { id: number; name: string }) => {
          genreMap[g.id] = g.name;
        });
      }

      // Map TMDB movies to our domain Movie type
      let movies: Movie[] = rawMovies.map((m: TmdbMovieResult) => ({
        id: m.id,
        title: m.title,
        overview: m.overview,
        posterPath: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=500",
        backdropPath: m.backdrop_path ? `https://image.tmdb.org/t/p/original${m.backdrop_path}` : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200",
        releaseDate: m.release_date || "",
        rating: Math.round((m.vote_average || 0) * 10) / 10,
        genres: (m.genre_ids || []).map((gid: number) => genreMap[gid] || "Other").filter((n: string) => n !== "Other"),
        runtime: undefined, // Must fetch individual details for this
      }));

      // Apply client-side filtering for genre and rating since TMDB's simple endpoints don't easily mix complex client parameters
      if (filters.selectedGenre) {
        movies = movies.filter((m) => m.genres.includes(filters.selectedGenre));
      }
      if (filters.minRating > 0) {
        movies = movies.filter((m) => m.rating >= filters.minRating);
      }

      // Apply sorting
      movies.sort((a, b) => {
        if (filters.sortBy === "rating") {
          return b.rating - a.rating;
        } else if (filters.sortBy === "releaseDate") {
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        } else {
          return a.title.localeCompare(b.title);
        }
      });

      return movies;
    } catch (err) {
      console.warn("TMDB Fetch failed, falling back to mock database", err);
      // Fallback to local filtering if TMDB requests fail
    }
  }

  // Local filtering & sorting logic
  let filtered = [...MOCK_MOVIES];

  if (filters.searchQuery.trim().length > 0) {
    const q = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.overview.toLowerCase().includes(q) ||
        m.director?.toLowerCase().includes(q)
    );
  }

  if (filters.selectedGenre) {
    filtered = filtered.filter((m) => m.genres.includes(filters.selectedGenre));
  }

  if (filters.minRating > 0) {
    filtered = filtered.filter((m) => m.rating >= filters.minRating);
  }

  // Sorting
  filtered.sort((a, b) => {
    if (filters.sortBy === "rating") {
      return b.rating - a.rating;
    } else if (filters.sortBy === "releaseDate") {
      return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
    } else {
      return a.title.localeCompare(b.title);
    }
  });

  return new Promise((resolve) => {
    setTimeout(() => resolve(filtered), 400); // Simulate network latency
  });
}

interface TmdbVideo {
  site: string;
  type: string;
  key: string;
}

interface TmdbCast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface TmdbCrew {
  job: string;
  name: string;
}

interface TmdbGenre {
  name: string;
}

/**
 * Fetch detailed movie object, including full cast lists.
 */
export async function getMovieDetails(id: number, apiKey?: string): Promise<Movie | null> {
  if (apiKey && apiKey.trim().length > 0) {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=videos,credits&language=en-US`
      );
      if (!res.ok) throw new Error("TMDB detail fetch failed");
      const m = await res.json();

      const youtubeVideo = (m.videos?.results as TmdbVideo[] || []).find(
        (v: TmdbVideo) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
      );

      const cast: Cast[] = (m.credits?.cast as TmdbCast[] || []).slice(0, 5).map((c: TmdbCast) => ({
        id: c.id,
        name: c.name,
        character: c.character,
        profilePath: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : undefined,
      }));

      const crew = m.credits?.crew as TmdbCrew[] || [];
      const directorObj = crew.find((member: TmdbCrew) => member.job === "Director");

      const mapped: Movie = {
        id: m.id,
        title: m.title,
        overview: m.overview,
        posterPath: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=500",
        backdropPath: m.backdrop_path ? `https://image.tmdb.org/t/p/original${m.backdrop_path}` : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200",
        releaseDate: m.release_date || "",
        rating: Math.round((m.vote_average || 0) * 10) / 10,
        genres: (m.genres as TmdbGenre[] || []).map((g: TmdbGenre) => g.name),
        runtime: m.runtime || undefined,
        trailerUrl: youtubeVideo?.key || undefined,
        director: directorObj?.name || "Unknown",
        cast,
      };

      return mapped;
    } catch (err) {
      console.warn("TMDB Detail fetch failed, searching locally...", err);
    }
  }

  const local = MOCK_MOVIES.find((m) => m.id === id);
  if (!local) return null;

  return new Promise((resolve) => {
    setTimeout(() => resolve(local), 200);
  });
}
