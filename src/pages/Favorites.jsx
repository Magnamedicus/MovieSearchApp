import "../css/Favorites.css";
import { useEffect, useState } from "react";
import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";
import { getMovieDetails, posterUrl } from "../services/api";

const Favorites = () => {
  const { favorites = [] } = useMovieContext();

  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  
  const openDetails = async (fav) => {
    try {
      setModalOpen(true);
      setModalLoading(true);
      setModalError(null);

      
      
      const id =
        (fav && typeof fav === "object" ? fav.id : fav) ??
        (fav?.movieId ?? fav?.tmdbId);

      const details = await getMovieDetails(id);
      setSelectedMovie(details);
    } catch (err) {
      console.error(err);
      setModalError("Failed to load movie details.");
      
      if (fav && typeof fav === "object") {
        setSelectedMovie({
          ...fav,
          overview: fav.overview || "No overview available.",
        });
      }
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

  
  useEffect(() => () => closeDetails(), []);

  
  
  
  const items = Array.isArray(favorites) ? favorites : [];

  if (items.length > 0)
    return (
      <div className="favorites">
        <h2>Your Favorites</h2>

        <div className="movies-grid">
          {items
            .filter(
              (m) =>
                
                (m && typeof m === "object" && posterUrl(m.poster_path)) ||
                typeof m !== "object"
            )
            .map((movie, i) => (
              <MovieCard
                key={(movie && movie.id) || movie || i}
                movie={movie}
                onSelect={openDetails}
              />
            ))}
        </div>

        {/* Modal (details + trailer) */}
        <MovieModal open={modalOpen} onClose={closeDetails} movie={selectedMovie} />
        {modalOpen && modalLoading && (
          <div className="modal-loading">Loading details…</div>
        )}
        {modalOpen && modalError && (
          <div className="modal-error">{modalError}</div>
        )}
      </div>
    );

  return (
    <div className="favorites-empty">
      <h2>No Favorite Movies Yet</h2>
      <p>Add some from the home page to see them here.</p>
    </div>
  );
};

export default Favorites;
