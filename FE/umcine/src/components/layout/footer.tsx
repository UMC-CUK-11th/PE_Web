export function Footer() {
  return <footer className="border-t border-gray-200 bg-white px-6 py-6 text-center text-xs text-gray-600">
    <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer" aria-label="TMDB">
      <img src="/images/logos/tmdb-logo.svg" alt="TMDB" className="mx-auto mb-3 w-20" />
    </a>
    <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
  </footer>;
}
