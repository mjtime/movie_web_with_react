import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Movie from "../components/Movie";
import SlideShow from "../components/SlideShow";
import { useSearchParams } from "react-router-dom";
import styles from "./Home.module.css";
import useWindowSize from "../hooks/useWindowSize";

function Home() {
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [moviesByGenre, setMoviesByGenre] = useState({}); // 장르별 영화 정보
  const [filteredMovies, setFilteredMovies] = useState([]); // 검색된 영화 정보
  const [isFiltering, setIsFiltering] = useState(false); // 필터링 상태
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInputRef = useRef(null); // 검색창 연결
  const [slideMovies, setSlideMovies] = useState([]); // 슬라이드쇼 영화 정보
  const [selectedGenre, setSelectedGenre] = useState("All"); // 선택된 장르 상태 추가
  const [menuEl, setMenuEl] = useState(null); // 장르 메뉴 가로스크롤 대상
  const [isGenreMenuOpen, setIsGenreMenuOpen] = useState(false); // 장르 메뉴 열림 상태
  const [genreDropdownStyle, setGenreDropdownStyle] = useState({}); // 장르 메뉴 드롭다운 위치 설정
  const genreMenuContainerRef = useRef(null);
  const windowSize = useWindowSize(); // 커스텀 훅을 통해 창 크기 정보 가져오기
  const [isMouseOverGenreMenuBtn, setIsMouseOverGenreMenuBtn] = useState(false); // 장르 드롭다운 버튼 마우스 오버 상태
  const [isMouseOverGenreDropdown, setIsMouseOverGenreDropdown] =
    useState(false); // 장르 드롭다운 창 마우스 오버 상태

  // 두 ref를 모두 업데이트하는 콜백 함수
  const genreMenuRef = (element) => {
    // useRef로 관리하는 값 업데이트
    genreMenuContainerRef.current = element;
    // useState를 통해 저장할 경우 업데이트
    setMenuEl(element);
  };

  // 각 장르별 현재 "왼쪽 포스터 인덱스" (페이지 단위 이동)
  const [leftPosterIndex, setLeftPosterIndex] = useState({});

  // 창 크기에 따른 한 페이지당 영화 개수 (데스크탑, 태블릿, 모바일)
  const getMoviesPerPage = () => {
    if (window.innerWidth >= 1470) return 9;
    if (window.innerWidth >= 1270) return 7;
    if (window.innerWidth >= 970) return 6;
    if (window.innerWidth >= 768) return 4;
    return 3;
  };
  const [moviesPerPage, setMoviesPerPage] = useState(getMoviesPerPage());

  // 각 장르별 슬라이드 컨테이너의 ref와 실제 너비(px)를 저장할 state
  const containerRefs = useRef({});
  const [containerWidths, setContainerWidths] = useState({});

  // 마우스 오버된 장르 저장 (슬라이드에 버튼 노출 제어)
  const [hoveredGenre, setHoveredGenre] = useState(null);

  // 장르 목록 (하드코딩)
  const genre_list = [
    "All",
    "Action",
    "Adventure",
    "Animation",
    "Biography",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "Film-Noir",
    "Game-Show",
    "History",
    "Horror",
    "Music",
    "Musical",
    "Mystery",
    "Reality-TV",
    "Romance",
    "Sci-Fi",
    "Seasonal",
    "Sport",
    "Talk-Show",
    "Thriller",
    "War",
    "Western",
  ];

  // 영화 데이터 요청 (장르별)
  const getMovieByGenres = async () => {
    setLoading(true);
    const newMoviesByGenre = {};
    const url = new URL("https://yts.mx/api/v2/list_movies.json?");

    for (const genre of [
      "Action",
      "Animation",
      "Comedy",
      "Drama",
      "Reality-TV",
    ]) {
      url.searchParams.set("genre", genre);
      url.searchParams.set("limit", 18);
      const response = await fetch(url.toString());
      const json = await response.json();

      newMoviesByGenre[genre] = json.data.movies ? json.data.movies : [];
    }

    setMoviesByGenre(newMoviesByGenre);
    setLoading(false);
  };

  // 슬라이드쇼 영화 요청
  const getSlideMovies = async () => {
    const url = new URL("https://yts.mx/api/v2/list_movies.json?");
    url.searchParams.set("sort_by", "rating");
    url.searchParams.set("limit", 5);

    const response = await fetch(url.toString());
    const json = await response.json();

    if (json.data.movies) {
      setSlideMovies(json.data.movies);
    }
  };

  // 검색 및 장르 필터링 영화 요청
  const getFilteredMovies = async () => {
    const url = new URL("https://yts.mx/api/v2/list_movies.json?");
    const genre = searchParams.get("genre");
    if (genre && genre !== "All") {
      url.searchParams.set("genre", genre);
    }
    const query = searchParams.get("query_term");
    if (query && query.length > 1) {
      url.searchParams.set("query_term", query);
    }

    const response = await fetch(url.toString());
    const json = await response.json();
    setFilteredMovies(json.data.movies ? json.data.movies : []);
  };

  // 검색/장르 파라미터 변화 시
  useEffect(() => {
    const genre = searchParams.get("genre");
    const query = searchParams.get("query_term");

    if (genre || query) {
      setIsFiltering(true);
      getFilteredMovies();
    } else {
      setIsFiltering(false);
    }
  }, [searchParams]);

  // 최초 로드 시 영화 데이터 요청
  useEffect(() => {
    getMovieByGenres();
    getSlideMovies();
  }, []);

  // 창 크기 변경 시 moviesPerPage 재계산 및 컨테이너 너비 재측정
  useEffect(() => {
    const handleResize = () => {
      setMoviesPerPage(getMoviesPerPage()); // 창 크기에 따른 한 페이지당 영화 개수 갱신
      handleContainerResize();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 가로 스크롤 슬라이드 컨테이너의 실제 px 너비 측정하여 state에 저장
  const handleContainerResize = () => {
    const newWidths = {};
    for (const genre in containerRefs.current) {
      if (containerRefs.current[genre]) {
        newWidths[genre] = containerRefs.current[genre].clientWidth;
      }
    }
    setContainerWidths(newWidths);
  };

  // 영화 데이터가 로드된 후, 검색창에서 메인화면으로 돌아왔을 때 측정
  useEffect(() => {
    handleContainerResize();
  }, [moviesByGenre, isFiltering]);

  // 다음 버튼 (한 페이지씩 이동)
  const handleNextButtonClick = (genre) => {
    setLeftPosterIndex((prevIndexes) => {
      const currentIndex = prevIndexes[genre] || 0;
      // 왼쪽 포스터가 가질 수 있는 최대 인덱스 = 영화 개수 - 한 페이지당 영화 개수
      const maxIndex = moviesByGenre[genre]
        ? Math.max(moviesByGenre[genre].length - moviesPerPage, 0)
        : 0;
      // 새로운 인덱스 = 현재 인덱스 + 한 페이지당 영화 개수 (최대 인덱스까지)
      const newIndex = Math.min(currentIndex + moviesPerPage, maxIndex);
      return { ...prevIndexes, [genre]: newIndex };
    });
  };

  // 이전 버튼
  const handlePrevButtonClick = (genre) => {
    setLeftPosterIndex((prevIndexes) => {
      const currentIndex = prevIndexes[genre] || 0;
      // 새로운 인덱스 = 현재 인덱스 - 한 페이지당 영화 개수 (0 미만이면 0으로)
      const newIndex = Math.max(currentIndex - moviesPerPage, 0);
      return { ...prevIndexes, [genre]: newIndex };
    });
  };

  // 장르 선택
  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      if (genre === "All") {
        newParams.delete("genre");
      } else {
        newParams.set("genre", genre);
      }
      return newParams;
    });
  };

  // 검색
  const handleSearch = (query) => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      if (query) {
        newParams.set("query_term", query);
      } else {
        newParams.delete("query_term");
      }
      return newParams;
    });
  };

  // 검색창 clear 버튼
  const clearSearch = () => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.delete("query_term");
      return newParams;
    });
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
  };

  // 마우스 휠 사용시 가로스크롤 작동
  useEffect(() => {
    if (!menuEl) return; // menuEl이 아직 설정되지 않았다면 종료

    const handleWheel = (e) => {
      e.preventDefault(); // 기본 스크롤 방지
      // 가로 스크롤
      menuEl.scrollBy({
        left: e.deltaY, // 수직 스크롤 양만큼 수평 스크롤
        behavior: "smooth",
      });
    };

    // passive: false 옵션을 주어 브라우저가 이벤트의 preventDefault 호출을 인지
    menuEl.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      menuEl.removeEventListener("wheel", handleWheel);
    };
  }, [menuEl]); // menuEl이 변경될 때마다 실행

  // 마우스 드래그(클릭)로 가로스크롤 작동
  useEffect(() => {
    if (!menuEl) return;

    let isDown = false; // 드래그 상태
    let startX;
    let scrollLeft;

    const mouseDownHandler = (e) => {
      isDown = true;
      // 드래그 시작 위치를 저장
      startX = e.pageX - menuEl.offsetLeft;
      scrollLeft = menuEl.scrollLeft;
    };

    const mouseLeaveHandler = () => {
      isDown = false;
    };

    const mouseUpHandler = () => {
      isDown = false;
    };

    const mouseMoveHandler = (e) => {
      if (!isDown) return;
      e.preventDefault();
      // 현재 마우스 위치와 시작 위치의 차이를 계산
      const x = e.pageX - menuEl.offsetLeft;
      const walk = (x - startX) * 1; // 스크롤 속도 조절
      menuEl.scrollLeft = scrollLeft - walk;
    };

    menuEl.addEventListener("mousedown", mouseDownHandler);
    menuEl.addEventListener("mouseleave", mouseLeaveHandler);
    menuEl.addEventListener("mouseup", mouseUpHandler);
    menuEl.addEventListener("mousemove", mouseMoveHandler);

    return () => {
      menuEl.removeEventListener("mousedown", mouseDownHandler);
      menuEl.removeEventListener("mouseleave", mouseLeaveHandler);
      menuEl.removeEventListener("mouseup", mouseUpHandler);
      menuEl.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, [menuEl]);

  // 드롭다운 메뉴 위치 업데이트, genreMenuContainerRef 위치에 따라 변경
  useEffect(() => {
    if (genreMenuContainerRef.current) {
      const rect = genreMenuContainerRef.current.getBoundingClientRect();
      setGenreDropdownStyle({
        position: "absolute",
        top: rect.top + "px",
        left: rect.left + "px",
        width: rect.width + "px",
        zIndex: 1000,
      });
    }
  }, [isGenreMenuOpen, windowSize]); // 장르 메뉴 열림 상태가 변경될 때마다 위치 업데이트

  // 장르 메뉴 열기/닫기
  useEffect(() => {
    // 드롭다운 버튼 또는 창에 마우스가 올려진 경우 드롭다운 열기
    if (isMouseOverGenreMenuBtn || isMouseOverGenreDropdown) {
      setIsGenreMenuOpen(true);
    } else {
      setIsGenreMenuOpen(false);
    }
  }, [isMouseOverGenreMenuBtn, isMouseOverGenreDropdown]);

  return (
    <div className={styles.homePagecontainer}>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div>
          <div className={styles.filterContainer}>
            <div className={styles.menuContainer}>
              <button
                className={styles.genre_toggle_btn}
                onMouseEnter={() => setIsMouseOverGenreMenuBtn(true)}
                onMouseLeave={() => setIsMouseOverGenreMenuBtn(false)}
              >
                +
              </button>
              {/* 장르 버튼 */}
              <ul ref={genreMenuRef} className={styles.genreMenu}>
                {genre_list.map((genres_category) => (
                  <li key={genres_category}>
                    <button
                      onClick={() => handleGenreChange(genres_category)}
                      className={
                        selectedGenre === genres_category
                          ? styles.selectedGenre
                          : ""
                      }
                    >
                      {genres_category}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Portal을 이용해 드롭다운 메뉴 렌더링 */}
              {createPortal(
                <div
                  className={`${styles.dropdownGenresMenu} ${
                    isGenreMenuOpen ? styles.open : ""
                  }`}
                  style={genreDropdownStyle}
                  onMouseEnter={() => setIsMouseOverGenreDropdown(true)}
                  onMouseLeave={() => setIsMouseOverGenreDropdown(false)}
                >
                  {genre_list.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => {
                        handleGenreChange(genre);
                        setIsGenreMenuOpen(false);
                      }}
                      className={
                        selectedGenre === genre ? styles.selectedGenre : ""
                      }
                    >
                      {genre}
                    </button>
                  ))}
                </div>,
                document.body
              )}
            </div>
            {/* 제목 검색창 */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className={styles.searchContainer}
            >
              <span className={styles.iconSearch}>🔍</span>
              <input
                type="text"
                name="query_term"
                placeholder="movie title"
                defaultValue={searchParams.get("query_term") || ""}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && e.preventDefault()} // 엔터키 입력 방지
                ref={searchInputRef}
                className={styles.searchInput}
              />
              {searchParams.get("query_term") && (
                <button onClick={clearSearch} className={styles.clearButton}>
                  X
                </button>
              )}
            </form>
          </div>
          {/* 슬라이드 쇼 */}
          {isFiltering ? null : <SlideShow movies={slideMovies} />}

          {/* 영화 목록 */}
          {isFiltering ? (
            <div className={styles.gridContainer}>
              {filteredMovies.length > 0 ? (
                filteredMovies.map((movie) => (
                  <Movie
                    key={movie.id}
                    id={movie.id}
                    coverImg={movie.medium_cover_image}
                    title={movie.title}
                    summary={movie.summary}
                    genres={movie.genres}
                  />
                ))
              ) : (
                <p>No movie found.</p>
              )}
            </div>
          ) : (
            Object.entries(moviesByGenre).map(([genre, movies]) => {
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

              const currentIndex = leftPosterIndex[genre] || 0;
              // containerWidths[genre]가 측정된 값 (px)
              const containerWidth = containerWidths[genre] || 0;

              // 고정값: 양쪽 프리뷰 영역과 gap
              const previewPx = 80; // 양쪽 프리뷰 (좌우 각각 80px)
              const gapPx = 2; // 포스터 사이 간격

              // 실제 컨텐츠 영역 너비 = containerWidth - 2*previewPx
              const contentWidth = Math.max(containerWidth - 2 * previewPx, 0);

              // 한 페이지에 보여줄 포스터 개수에 맞게 포스터 한 개의 폭 계산
              let itemWidthPx = 0;
              if (moviesPerPage > 0) {
                itemWidthPx =
                  (contentWidth - gapPx * (moviesPerPage - 1)) / moviesPerPage;
              }

              // 이동 거리 = currentIndex * (포스터 폭 + gap)
              const offsetPx = currentIndex * (itemWidthPx + gapPx);

              // 총 페이지 수 및 현재 페이지 (도트 표시에 사용)
              const totalPages = Math.ceil(movies.length / moviesPerPage);
              const pageIndex = Math.floor(currentIndex / moviesPerPage);

              return (
                <div className={styles.genreListContainre} key={genre}>
                  <div className={styles.genreListHeader}>
                    <h2 className={styles.genreListTitle}>{genre}</h2>

                    {/* 페이지 도트 */}
                    <ul className={styles.pageDots}>
                      {Array.from({ length: totalPages }).map((_, index) => (
                        <li
                          key={index}
                          style={{
                            width: "10px",
                            height: "10px",
                            margin: "5px",
                            borderRadius: "50%",
                            backgroundColor:
                              index === pageIndex ? "orange" : "#555",
                            transition: "background-color 0.3s",
                          }}
                        />
                      ))}
                    </ul>
                  </div>

                  <div className={styles.scrollContainer}>
                    {/* 스크롤 슬라이드 영역 */}
                    <div
                      ref={(el) => (containerRefs.current[genre] = el)}
                      style={{
                        position: "relative",
                        width: "100vw", // 전체 영역 (px 단위 계산은 내부에서)
                        margin: "0 auto",
                        // overflow: "hidden",
                      }}
                      onMouseEnter={() => setHoveredGenre(genre)}
                      onMouseLeave={() => setHoveredGenre(null)}
                    >
                      {/* 실제 컨텐츠 영역: 좌우 previewPx 만큼 여백 */}
                      <div
                        style={{
                          width: contentWidth,
                          marginLeft: previewPx,
                          marginRight: previewPx,
                          // overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: `${gapPx}px`,
                            transition: "transform 0.5s ease-in-out",
                            transform: `translateX(-${offsetPx}px)`,
                          }}
                        >
                          {movies.map((movie) => (
                            <div
                              className={styles.movieHover}
                              key={movie.id}
                              style={{
                                flex: `0 0 ${itemWidthPx}px`,
                              }}
                            >
                              <Movie
                                id={movie.id}
                                coverImg={movie.medium_cover_image}
                                title={movie.title}
                                summary={movie.summary}
                                genres={movie.genres}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* 좌측 오버레이: 왼쪽 previewPx 영역에 반투명 검정 그라데이션 */}
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          bottom: 0,
                          width: `${previewPx}px`,
                          background:
                            "linear-gradient(to right, rgba(0,0,0,0.8), transparent)",
                        }}
                      >
                        {/* 좌우 버튼 (호버 시만 opacity:1) 
                        왼쪽 버튼 표시 조건: 현재 페이지가 0보다 크거나 왼쪽에 남은 포스터가 있는 경우
                        */}
                        {(pageIndex > 0 ||
                          (leftPosterIndex[genre]
                            ? leftPosterIndex[genre] % moviesPerPage !== 0
                            : false)) && (
                          <button
                            onClick={() => handlePrevButtonClick(genre)}
                            style={{
                              position: "absolute",
                              height: "100%",
                              width: "100%",
                              top: "50%",
                              left: "10px",
                              transform: "translateY(-50%)",
                              opacity: hoveredGenre === genre ? 1 : 0,
                              transition: "opacity 0.3s",
                              zIndex: 3,
                              backgroundColor: "transparent",
                              border: "none",
                              color: "white",
                              padding: "10px",
                              cursor: "pointer",
                              fontSize: "30px",
                            }}
                          >
                            ◀
                          </button>
                        )}
                      </div>

                      {/* 우측 오버레이: 오른쪽 previewPx 영역에 반투명 검정 그라데이션 */}
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          bottom: 0,
                          width: `${previewPx}px`,
                          background:
                            "linear-gradient(to left, rgba(0,0,0,0.8), transparent)",
                        }}
                      >
                        {pageIndex < totalPages - 1 && (
                          <button
                            onClick={() => handleNextButtonClick(genre)}
                            style={{
                              position: "absolute",
                              height: "100%",
                              width: "100%",
                              top: "50%",
                              right: "10px",
                              transform: "translateY(-50%)",
                              opacity: hoveredGenre === genre ? 1 : 0,
                              transition: "opacity 0.3s",
                              zIndex: 3,
                              backgroundColor: "transparent",
                              border: "none",
                              color: "white",
                              padding: "10px",
                              cursor: "pointer",
                              fontSize: "30px",
                            }}
                          >
                            ▶
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
