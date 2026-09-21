import "./footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <img
        className="tmdb-logo"
        src="/umcine-images/images/logos/tmdb-logo.svg"
        alt="TMDB"
      />

      <p>
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
    </footer>
  );
}