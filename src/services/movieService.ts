import axios from 'axios';
import type { MovieApiResponse } from "../types/movie";




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

console.log('API KEY from env:', import.meta.env.VITE_TMDB_API_KEY);
  return response.data;
};


