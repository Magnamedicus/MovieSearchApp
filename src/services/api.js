// src/services/api.js
const API_Key = "b67da9459638addc38e7c74b453d02b5";
const Base_URL = "https://api.themoviedb.org/3";

const json = async (res) => {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} – ${text || "TMDB error"}`);
  }
  return res.json();
};

export const getPopularMovies = async () => {
  const res = await fetch(`${Base_URL}/movie/popular?api_key=${API_Key}`);
  const data = await json(res);
  return data.results ?? [];
};

export const searchMovies = async (query) => {
  const res = await fetch(
    `${Base_URL}/search/movie?api_key=${API_Key}&query=${encodeURIComponent(query)}`
  );
  const data = await json(res);
  return data.results ?? [];
};

export const getMovieDetails = async (id) => {
  const url = `${Base_URL}/movie/${id}?api_key=${API_Key}&append_to_response=videos,credits`;
  const res = await fetch(url);
  return json(res);
};

export const posterUrl = (path, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
