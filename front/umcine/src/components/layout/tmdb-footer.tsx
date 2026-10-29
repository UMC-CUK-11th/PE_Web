export function TmdbFooter() {
  return (
    <footer className="flex min-h-9 items-center justify-center gap-2 border-t border-[#e7e9ed] bg-white px-6 text-center text-[10px] text-[#8a9099] md:justify-end md:px-12">
      <img className="w-[22px]" src="/images/logos/tmdb-logo.svg" alt="TMDB" />
      <span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span>
    </footer>
  );
}
