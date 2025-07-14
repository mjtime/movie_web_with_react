import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./Detail.module.css";
import Movie from "components/Movie/Movie";

function Detail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false); // 줄거리 확장 여부
  const descriptionThreshold = 300; // 표시할 줄거리 길이
  const getMovie = async () => {
    const json = await (
      await fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
    ).json();

    // 영화 정보 저장
    setMovie(json.data.movie);
  };

  useEffect(() => {
    getMovie();
  }, []);

  // 줄거리 더보기 기능
  // movie.description_intro가 긴 경우 잘린 텍스트와 전체 텍스트 결정
  const truncatedDescription =
    movie && movie.description_intro.length > descriptionThreshold
      ? movie.description_intro.substring(0, descriptionThreshold) + "..."
      : movie && movie.description_intro;

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
            alt={`${movie.title} background`}
          />
          <div className={styles.detailWrapper}>
            <div className={styles.detailContent}>
              <div className={styles.detailHeader}>
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
                  </div>
                </div>
                <div className={styles.moviePosterContainer}>
                  <Movie
                    id={movie.id}
                    coverImg={movie.medium_cover_image}
                    title={movie.title}
                    genres={movie.genres}
                    showOverlay={false}
                  />
                </div>
              </div>
              <div className={styles.detailMain}>
                <p style={{ whiteSpace: "pre-wrap" }}>
                  {isExpanded ? movie.description_intro : truncatedDescription}
                  <span>
                    {movie.description_intro &&
                      movie.description_intro.length > descriptionThreshold && (
                        <button
                          className={styles.toggleButton}
                          onClick={() => setIsExpanded((prev) => !prev)}
                        >
                          {isExpanded ? "접기" : "더보기"}
                        </button>
                      )}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Detail;
