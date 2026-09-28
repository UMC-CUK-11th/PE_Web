export function Footer() {
  return (
    <>
      <footer className="flex justify-end items-center max-h-[57px] px-20 py-[16px] gap-[8px] border border-[#e3e6eb]">
        <img
          src="\images\logos\tmdb-logo.svg"
          alt="logo"
          className="w-[24px] h-[24px]"
        />
        <p className="flex items-center h-[14px] w-[398px] text-[12px] text-[#606774]">
          This product uses the TMDB API but is not endorsed or certified by
          TMDB.
        </p>
      </footer>
    </>
  );
}
