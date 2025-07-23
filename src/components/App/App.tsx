import { useState } from "react";
import { useEffect } from "react";

import toast, { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";
import styles from './App.module.css';

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

import type { MovieApiResponse } from "../../services/movieService";

import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isSuccess } = useQuery<MovieApiResponse>({
  queryKey: ["movies", { query: searchQuery, page }],
  queryFn: () => fetchMovies({ query: searchQuery, page }),
  enabled: !!searchQuery.trim(),
  placeholderData: keepPreviousData,
});

useEffect(() => {
  if (isSuccess && data && data.results.length === 0) {
    toast.error("No movies found for your search.");
  }
}, [isSuccess, data]);


  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      toast.error("Please enter a valid search query.");
      return;
    }
    setSearchQuery(query);
    setPage(1); 
  };

  const handleSelectMovie = (movie: Movie): void => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = (): void => {
    setSelectedMovie(null);
  };

  return (
    <div className={styles.app}>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {!isLoading && !isError && movies.length > 0 && (
        <>
          <MovieGrid movies={movies} onSelect={handleSelectMovie} />

          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={styles.pagination}
              activeClassName={styles.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}
