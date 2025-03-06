import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styles from "./Movie.module.css";

function Movie({ id, coverImg, title, summary, genres }) {
  // 장르 3개까지만 출력, 그 외에는 '⋮' 출력
  const displayedGenres =
    genres.length > 3 ? genres.slice(0, 3).concat("⋮") : genres;
  return (
    <Link to={`/movie/${id}`} className={styles.movieLink}>
      <div className={styles.movieContainer}>
        <img className={styles.movieImage} src={coverImg} alt={title} />
        <div className={styles.overlay}>
          <div className={styles.overlayContent}>
            <h2 className={styles.overlayTitle}>{title}</h2>
            <ul className={styles.overlayGenreList}>
              {displayedGenres.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Link>
  );
}

Movie.propTypes = {
  id: PropTypes.number.isRequired,
  coverImg: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  genres: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Movie;
