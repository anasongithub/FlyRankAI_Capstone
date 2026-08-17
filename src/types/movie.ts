export interface Cast {
  id: number;
  name: string;
  character: string;
  profilePath?: string;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  releaseDate: string;
  rating: number; // e.g. 8.4
  genres: string[];
  runtime?: number; // in minutes
  trailerUrl?: string; // YouTube embed ID or full link
  cast?: Cast[];
  director?: string;
}

export interface UserSettings {
  displayName: string;
  avatarUrl: string;
  tmdbApiKey: string;
  geminiApiKey?: string;
  notificationsEnabled: boolean;
}

export interface FilterState {
  searchQuery: string;
  selectedGenre: string;
  minRating: number;
  sortBy: 'rating' | 'releaseDate' | 'title';
}
