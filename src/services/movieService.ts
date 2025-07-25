import axios from 'axios';
import type { Movie } from "../types/movie";


export interface MovieApiResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

export interface MovieQueryParams {
    query: string;
    page: number;
}

const apiClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
    accept: 'application/json',
  },
});


export const fetchMovies = async ({
  query, page,
}: MovieQueryParams): Promise<MovieApiResponse> => {
  const trimmedQuery = query.trim();

  const endpoint = trimmedQuery
    ? 'https://api.themoviedb.org/3/search/movie'
    : 'https://api.themoviedb.org/3/movie/popular';



   const response = await apiClient.get<MovieApiResponse>(endpoint, {
    params: {
      ...(trimmedQuery && { query: trimmedQuery }),
      page,
    },
  });

  return response.data;
};


