import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styles from "./CategorySlider.module.css";
import Movie from "components/Movie/Movie";

function CategorySlider({ genre, movies, movieIcon = "" }) {
  const PREVIEW_PX = 80; // 양쪽에 남길 고정 프리뷰 영역
  const GAP_PX = 2; // 포스터 사이의 간격
  const movieLength = movies.length;

  // 창 크기에 따른 한 페이지당 영화 개수 (데스크탑, 태블릿, 모바일)
  const getMoviesPerPage = () => {
    if (window.innerWidth >= 1470) return 9;
    if (window.innerWidth >= 1270) return 7;
    if (window.innerWidth >= 970) return 6;
    if (window.innerWidth >= 768) return 4;
    return 3;
  };

  const [hovered, setHovered] = useState(false);
  const [moviesPerPage, setMoviesPerPage] = useState(getMoviesPerPage());
  // 각 장르별 현재 왼쪽 포스터 인덱스 (페이지 단위 이동)
  const [leftPosterIndex, setLeftPosterIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const containerRef = useRef(null);

  // container 너비 측정
  const handleContainerResize = () => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
  };

  // 창 크기 변경 시 영화 개수 및 container 너비 갱신
  useEffect(() => {
    const handleResize = () => {
      setMoviesPerPage(getMoviesPerPage());
      handleContainerResize();
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // moviesPerPage 변경 시 현재 인덱스가 범위를 벗어나지 않도록 보정
  useEffect(() => {
    const maxIndex = Math.max(movieLength - moviesPerPage, 0);
    setLeftPosterIndex((prev) => Math.min(prev, maxIndex));
  }, [moviesPerPage, movieLength]);

  /*
  < 역할 설명 >
  containerWidth: 해당 장르 슬라이드 컨테이너의 실제 너비 (px)
  PREVIEW_PX: 양쪽에 남길 고정 프리뷰 영역 (px)
  contentWidth: 실제 포스터들이 채워질 영역의 너비 = containerWidth - 2 * PREVIEW_PX
  moviesPerPage: 한 페이지에 보여줄 포스터 개수 (창 크기에 따라 동적으로 결정)
  GAP_PX: 포스터 사이의 간격 (px)
  itemWidthPx: 각 포스터의 폭 = (contentWidth - GAP_PX * (moviesPerPage - 1)) / moviesPerPage
  offsetPx: 현재 leftPosterIndex에 따른 이동 거리 = currentIndex * (itemWidthPx + GAP_PX)
  */
  const currentIndex = leftPosterIndex || 0;
  const contentWidth = Math.max(containerWidth - 2 * PREVIEW_PX, 0);

  // 각 영화 아이템의 실제 너비 계산
  const itemWidthPx =
    moviesPerPage > 0
      ? (contentWidth - GAP_PX * (moviesPerPage - 1)) / moviesPerPage
      : 0;

  // 현재 leftPosterIndex에 따른 이동 거리
  const offsetPx = currentIndex * (itemWidthPx + GAP_PX);

  // 페이지 수 및 현재 페이지 인덱스 계산
  const totalPages = Math.ceil(movies.length / moviesPerPage);
  const pageIndex = Math.floor(currentIndex / moviesPerPage);

  // 다음 페이지 이동
  const handleNext = () => {
    setLeftPosterIndex((currentIndex) => {
      const maxIndex = Math.max(movieLength - moviesPerPage, 0);
      return Math.min(currentIndex + moviesPerPage, maxIndex);
    });
  };

  // 이전 페이지 이동
  const handlePrev = () => {
    setLeftPosterIndex((currentIndex) => {
      return Math.max(currentIndex - moviesPerPage, 0);
    });
  };

  return (
    <div className={styles.genreListContainer}>
      <div className={styles.genreListHeader}>
        <h2 className={styles.genreListTitle}>{genre}</h2>
        {/* 페이지 표시용 */}
        <div className={styles.progressBarContainer}>
          <div
            className={styles.progressBarFill}
            style={{
              "--progressBarWidth": `${(moviesPerPage / movieLength) * 100}%`,
              "--progressBarLeft": `${(leftPosterIndex / movieLength) * 100}%`,
            }}
          />
        </div>
        <div className={styles.genreIcon}>{movieIcon}</div>
      </div>

      <div className={styles.scrollContainer}>
        <div
          className={styles.innerContainer}
          ref={containerRef}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* 실제 컨텐츠 영역: 좌우 previewPx 만큼 여백 */}
          <div
            className={styles.sliderViewport}
            style={{
              "--contentWidth-px": `${contentWidth}px`,
              "--preview-px": `${PREVIEW_PX}px`,
            }}
          >
            <div
              className={styles.sliderTrack}
              style={{
                "--gap-px": `${GAP_PX}px`,
                "--offsetPx": `-${offsetPx}px`,
              }}
            >
              {movies.map((movie) => (
                <div
                  className={styles.movieContent}
                  key={movie.id}
                  style={{
                    "--itemWidthPx-px": `${100 / moviesPerPage}%`,
                  }}
                >
                  <Movie
                    id={movie.id}
                    coverImg={movie.medium_cover_image}
                    title={movie.title}
                    genres={movie.genres}
                    showOverlay
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 왼쪽 네비게이션 버튼 및 오버레이 */}
          <div
            className={`${styles.sideGradation} ${styles.left}`}
            style={{ "--preview-px": `${PREVIEW_PX}px` }}
          >
            {currentIndex > 0 && (
              <button
                className={[
                  styles.sliderNavButton,
                  styles["sliderNavButton--prev"],
                  hovered ? styles.sliderNavButtonVisible : "",
                ].join(" ")}
                onClick={handlePrev}
              >
                ◀
              </button>
            )}
          </div>
          {/* 오른쪽 네비게이션 버튼 및 오버레이 */}
          <div
            className={`${styles.sideGradation} ${styles.right}`}
            style={{ "--preview-px": `${PREVIEW_PX}px` }}
          >
            {pageIndex < totalPages - 1 && (
              <button
                className={[
                  styles.sliderNavButton,
                  styles["sliderNavButton--next"],
                  hovered ? styles.sliderNavButtonVisible : "",
                ].join(" ")}
                onClick={handleNext}
              >
                ▶
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

CategorySlider.propTypes = {
  genre: PropTypes.string.isRequired,
  movies: PropTypes.array.isRequired,
};

export default CategorySlider;
