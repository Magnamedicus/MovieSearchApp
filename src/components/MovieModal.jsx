// src/components/MovieModal.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import "../css/MovieModal.css";
import { posterUrl } from "../services/api";

export default function MovieModal({ open, onClose, movie }) {
  const dialogRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  
  const trailer = useMemo(() => {
    const vids = movie?.videos?.results ?? [];
    
    return (
      vids.find((v) => v.site === "YouTube" && v.type === "Trailer" && v.official) ||
      vids.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
      vids.find((v) => v.site === "YouTube" && v.type === "Teaser") ||
      null
    );
  }, [movie]);


  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  
  useEffect(() => {
    if (!open) return;
    const el = dialogRef.current;
    const focusable = el?.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus();
  }, [open]);

  
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [open]);

  
  useEffect(() => {
    if (!open) setPlaying(false);
  }, [open]);
  useEffect(() => setPlaying(false), [movie?.id]);

  if (!open) return null;

  const poster = posterUrl(movie?.poster_path, "w500");
  const year = movie?.release_date ? new Date(movie.release_date).getFullYear() : "";
  const genres = movie?.genres?.map((g) => g.name).join(", ");
  const runtime = movie?.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : "";
  const rating = movie?.vote_average ? movie.vote_average.toFixed(1) : null;
  const topCast = movie?.credits?.cast?.slice(0, 6) ?? [];

  
  const embedSrc =
    trailer?.site === "YouTube" && trailer?.key
      ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`
      : null;

  return (
    <div className="modal-backdrop" onClick={onClose} aria-hidden="true">
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-label={`${movie?.title} details`}
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close details">
          ×
        </button>

        <div className="modal-layout">
          {!playing && poster && (
            <img className="modal-poster" src={poster} alt={`${movie?.title} poster`} />
          )}

          <div className="modal-info">
            <h2 className="modal-title">
              {movie?.title} {year ? <span className="modal-year">({year})</span> : null}
            </h2>

            <div className="modal-meta">
              {genres && <span>{genres}</span>}
              {runtime && <span>• {runtime}</span>}
              {rating && <span>• ★ {rating}</span>}
            </div>

            {movie?.overview && !playing && (
              <p className="modal-overview">{movie.overview}</p>
            )}

            {/* Trailer controls */}
            {trailer && (
              <div className="modal-trailer">
                {!playing ? (
                  <button
                    className="trailer-btn"
                    onClick={() => setPlaying(true)}
                    aria-label="Play trailer"
                  >
                    ▶ Play Trailer
                  </button>
                ) : (
                  <div className="trailer-frame-wrap">
                    {embedSrc ? (
                      <iframe
                        className="trailer-frame"
                        src={embedSrc}
                        title={`Trailer: ${trailer.name || movie?.title}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <a
                        className="trailer-link"
                        href={`https://www.youtube.com/watch?v=${trailer?.key}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Watch trailer on YouTube
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}

            {!playing && topCast.length > 0 && (
              <div className="modal-cast">
                <h3>Top cast</h3>
                <ul>
                  {topCast.map((c) => (
                    <li key={c.cast_id || `${c.credit_id}-${c.id}`}>
                      {c.name}
                      {c.character ? <span className="as"> as {c.character}</span> : null}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
