import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Movie.module.css";
import NoPoster from "./NoPoster";

function Movie({ id, coverImg, title, summary, genres }) {
  // 장르가 존재하지 않으면 빈배열로 초기화
  // 장르가 3개 이상이면 3개까지만 출력하고, 그 외에는 '⋮' 출력
  const displayedGenres = genres
    ? genres.length > 3
      ? genres.slice(0, 3).concat("⋮")
      : genres
    : [];
  // 이미지 로딩 에러 상태
  const [imgError, setImgError] = useState(false);

  return (
    <Link to={`/movie/${id}`} className={styles.movieLink}>
      <div className={styles.movieContainer}>
        {!imgError ? (
          <img
            className={styles.movieImage}
            src={coverImg}
            alt={title}
            onError={() => setImgError(true)}
            // 로딩된 이미지 너비 0이면 에러로 처리
            onLoad={(e) => {
              if (e.target.naturalWidth === 0) {
                setImgError(true);
              }
            }}
          />
        ) : (
          <NoPoster title={title} />
        )}

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
