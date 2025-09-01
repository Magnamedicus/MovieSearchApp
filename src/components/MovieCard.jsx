import "../css/MovieCard.css";
import { posterUrl } from "../services/api";
import { useMovieContext } from "../contexts/MovieContext";

export default function MovieCard({ movie, onSelect }) {
  const ctx = useMovieContext?.() ?? {};
  const {
    favorites = [],
    isFavorite,            
    toggleFavorite,        
    addFavorite,           
    addToFavorites,        
    removeFavorite,        
    removeFromFavorites,   
  } = ctx;

  const src = posterUrl(movie?.poster_path);
  if (!src) return null;

  const idOf = (m) => (m && typeof m === "object" ? m.id : m);

  
  const computeIsFav = () => {
    if (typeof isFavorite === "function") {
      try {
        return Boolean(isFavorite(movie) || isFavorite(movie?.id));
      } catch {
        
      }
    }
    const mid = idOf(movie);
    return Array.isArray(favorites) && favorites.some((f) => idOf(f) === mid);
  };

  const isFav = computeIsFav();

  const doAdd = (m) => {
    if (typeof addFavorite === "function") return addFavorite(m);
    if (typeof addToFavorites === "function") return addToFavorites(m);
    console.warn(
      "[MovieCard] No addFavorite/addToFavorites available on context."
    );
  };

  const doRemove = (m) => {
    const id = idOf(m);
    if (typeof removeFavorite === "function") return removeFavorite(id);
    if (typeof removeFromFavorites === "function") return removeFromFavorites(id);
    console.warn(
      "[MovieCard] No removeFavorite/removeFromFavorites available on context."
    );
  };

  const handleToggleFavorite = (e) => {
    
    e.stopPropagation();
    
    e.preventDefault();

    if (typeof toggleFavorite === "function") {
      toggleFavorite(movie);
      return;
    }
    if (isFav) doRemove(movie);
    else doAdd(movie);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect?.(movie);
    }
  };

  return (
    <div
      className="movie-card"
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(movie)}
      onKeyDown={handleKey}
      aria-label={`Open details for ${movie?.title}`}
    >
      <div className="movie-card-media" style={{ position: "relative" }}>
        <img src={src} alt={`${movie?.title} poster`} className="movie-poster" />
        <button
          type="button"                 
          className={`fav-btn ${isFav ? "is-fav" : ""}`}
          title={isFav ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={isFav}
          onClick={handleToggleFavorite}
          style={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}
        >
          {isFav ? "♥" : "♡"}
        </button>
      </div>

      <div className="movie-info">
        <h3 className="movie-title">{movie?.title}</h3>
        {movie?.release_date && (
          <p className="movie-year">{new Date(movie.release_date).getFullYear()}</p>
        )}
      </div>
    </div>
  );
}
