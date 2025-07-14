import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Movie.module.css";
import NoPoster from "components/NoPoster/NoPoster";

function Movie({ id, coverImg, title, genres, showOverlay = true }) {
  // 장르가 존재하지 않으면 빈배열로 초기화
  // 장르가 3개 이상이면 3개까지만 출력하고, 그 외에는 '⋮' 출력
  const displayedGenres = genres
    ? genres.length > 3
      ? genres.slice(0, 3).concat("⋮")
      : genres
    : [];
  // 이미지 로딩 에러 상태
  const [imgError, setImgError] = useState(false);
  const shouldShowImg = !coverImg || imgError;
  const Wrapper = showOverlay ? Link : "div";
  return (
    <Wrapper
      {...(showOverlay
        ? { to: `/movie/${id}`, className: styles.movieLink }
        : {})}
    >
      {" "}
      <div
        className={
          showOverlay
            ? `${styles.movieContainer} ${styles.hoverable}`
            : styles.movieContainer
        }
      >
        {shouldShowImg ? (
          <NoPoster title={title} className={styles.movieImage} />
        ) : (
          <img
            className={styles.movieImage}
            src={coverImg}
            alt={title}
            onError={() => setImgError(true)}
            onLoad={(e) => {
              if (e.target.naturalWidth === 0) {
                setImgError(true);
              }
            }}
          />
        )}
        {showOverlay && (
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
        )}
      </div>
    </Wrapper>
  );
}

Movie.propTypes = {
  id: PropTypes.number.isRequired,
  coverImg: PropTypes.string,
  title: PropTypes.string.isRequired,
  genres: PropTypes.arrayOf(PropTypes.string),
};

export default Movie;
