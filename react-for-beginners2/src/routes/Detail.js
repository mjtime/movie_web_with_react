import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./Detail.module.css";
import NoPoster from "../components/NoPoster";

function Detail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [imgError, setImgError] = useState(false); // 포스터 이미지 로딩 상태
  const getMovie = async () => {
    const json = await (
      await fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
    ).json();

    // 영화 정보 저장
    setMovie(json.data.movie);
    console.log(json);
    console.log(movie);
  };

  useEffect(() => {
    getMovie();
  }, []);

  return (
    <div className={styles.detailPageContainer}>
      {movie === null ? ( // movie가 아직 로딩되지 않았을 때
        <div className={styles.loadingPage}>
          <h1>Loading...</h1>
        </div>
      ) : !movie.title ? ( // movie는 있지만 title이 null일 때 => 영화 정보가 없을 때
        <div className={styles.preparingPage}>
          <h1>🙏</h1>
          <h1>Sorry, the movie information is being prepared.</h1>
        </div>
      ) : (
        // 불러오는 동안 값 없어 발생하는 에러 방지
        <div className={styles.detailContainer}>
          <img
            className={styles.movieBackgroundImage}
            src={movie.background_image}
          />
          <div className={styles.detailWrapper}>
            <div className={styles.detailContent}>
              <div className={styles.movieInformation}>
                <h2>{movie.title}</h2>
                <div className={styles.movieDetail}>
                  <p>
                    {movie.year} | {movie.language}
                  </p>
                  <p>
                    ⏰{movie.runtime}m | ⭐{movie.rating}/10 | 💗
                    {movie.like_count}
                  </p>
                  <p className={styles.genresList}>
                    {movie.genres.map((g) => (
                      <li key={g}>{g}</li>
                    ))}
                  </p>
                  <p>{movie.description_intro}</p>
                </div>
              </div>
              <div className={styles.moviePosterContainer}>
                {!imgError ? (
                  <img
                    className={styles.moviePosterImage}
                    src={movie.medium_cover_image}
                    alt={movie.title}
                    onError={() => setImgError(true)}
                    // 로딩된 이미지 너비 0이면 에러로 처리
                    onLoad={(e) => {
                      if (e.target.naturalWidth === 0) {
                        setImgError(true);
                      }
                    }}
                  />
                ) : (
                  <NoPoster
                    title={movie.title}
                    className={styles.moviePosterImage}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Detail;
