import axios from 'axios';
import type { MovieApiResponse } from "../types/movie";




export interface MovieQueryParams {
    query: string;
    page: number;
}

export const fetchMovies = async ({
    query, page,
}: { query: string; page: number }): Promise<MovieApiResponse> => {

  const endpoint = query.trim()
    ? 'https://api.themoviedb.org/3/search/movie'
    : 'https://api.themoviedb.org/3/movie/popular';

  const response = await axios.get<MovieApiResponse>(endpoint, {
    params: {
      api_key: 'YOUR_API_KEY',
      query,
      page,
    },
  });

  return response.data;
};

