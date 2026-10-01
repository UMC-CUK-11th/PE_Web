export function Footer() {
  return (
    <footer className="flex h-[57px] w-full items-center justify-end gap-1.5 border-t border-[#e3e6eb] bg-white px-5 text-[10px] text-[#8b95a1] md:px-20">
      <img
        className="h-auto w-[30px]"
        src="/umcine-images/images/logos/tmdb-logo.svg"
        alt="TMDB"
      />

      <p className="m-0">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
    </footer>
  );
}
