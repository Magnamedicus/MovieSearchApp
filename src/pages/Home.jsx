import { useEffect, useState } from "react";
import "../css/Home.css";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";
import {
  getPopularMovies,
  searchMovies,
  getMovieDetails,
  posterUrl,
} from "../services/api";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const popular = await getPopularMovies();
        setMovies(popular);
      } catch (err) {
        console.error(err);
        setError("Failed to load popular movies.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    setLoading(true);
    setError(null);
    try {
      const results = await searchMovies(q);
      setMovies(results);
    } catch (err) {
      console.error(err);
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openDetails = async (movie) => {
    setModalOpen(true);
    setModalLoading(true);
    setModalError(null);
    try {
      const details = await getMovieDetails(movie.id);
      setSelectedMovie(details);
    } catch (err) {
      console.error(err);
      setModalError("Failed to load movie details.");
      setSelectedMovie({
        ...movie,
        overview: movie.overview || "No overview available.",
      });
    } finally {
      setModalLoading(false);
    }
  };

  const closeDetails = () => {
    setModalOpen(false);
    setSelectedMovie(null);
    setModalLoading(false);
    setModalError(null);
  };

  return (
    <div className="home">
      <form onSubmit={handleSearch} className="search-form">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
          placeholder="Search for movies..."
          className="search-input"
          aria-label="Search for movies"
        />
        <button type="submit" className="search-button" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Loading…</div>}

      {!loading && !error && (
        <div className="movies-grid">
          {movies
            .filter((m) => posterUrl(m.poster_path))
            .map((movie) => (
              <MovieCard key={movie.id} movie={movie} onSelect={openDetails} />
            ))}
          {!movies?.length && (
            <div className="empty-state">No results. Try another search.</div>
          )}
        </div>
      )}

      <MovieModal open={modalOpen} onClose={closeDetails} movie={selectedMovie} />
      {modalOpen && modalLoading && (
        <div className="modal-loading">Loading details…</div>
      )}
      {modalOpen && modalError && <div className="modal-error">{modalError}</div>}
    </div>
  );
};

export default Home;
