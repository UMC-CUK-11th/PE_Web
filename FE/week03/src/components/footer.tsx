export function Footer() {
  return (
    <footer className="flex min-h-14 items-center justify-center gap-3 border-t border-[#e8e9ed] bg-white px-5 py-4 text-center text-[10px] text-[#8b8e96]">
      <img
        className="h-auto w-[54px]"
        src="/umcine-images/images/logos/tmdb-logo.svg"
        alt="The Movie Database"
      />
      <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
    </footer>
  );
}
