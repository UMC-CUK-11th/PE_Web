export function SiteFooter() {
  return (
    <footer className="flex min-h-14 items-center justify-center gap-2 border-t border-[#e4e6ea] bg-white px-6 py-4 text-[10px] text-[#a1a5ad]">
      <img
        className="h-auto w-9"
        src="/images/logos/tmdb-logo.svg"
        alt="TMDB"
      />
      <p>
        This product uses the TMDB API but is not endorsed or certified by
        TMDB.
      </p>
    </footer>
  );
}
