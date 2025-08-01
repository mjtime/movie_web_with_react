import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./Home.module.css";
import Movie from "components/Movie/Movie";
import SlideShow from "components/SlideShow/SlideShow";
import useWindowSize from "hooks/useWindowSize";
import { GENRE_LIST } from "contents/genres";
import GenreMenu from "components/GenreMenu/GenreMenu";
import SearchBar from "components/SearchBar/SearchBar";
import CategorySlider from "components/CategorySlider/CategorySlider";
import genreConfigs from "contents/genreConfigs";
import useDebounce from "hooks/uesDebounce";

function Home() {
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [moviesByGenre, setMoviesByGenre] = useState({}); // 장르별 영화 정보
  const [filteredMovies, setFilteredMovies] = useState(null); // 검색된 영화 정보

  const [searchParams, setSearchParams] = useSearchParams(); // 현재 URL의 쿼리 파라미터(query string)
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("query_term") || ""
  ); // 검색어 상태
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // 디바운스된 검색어
  const searchInputRef = useRef(null); // 검색창 연결
  const initialFiltering = Boolean(
    searchParams.get("genre") || searchParams.get("query_term")
  );
  const [isFiltering, setIsFiltering] = useState(initialFiltering);
  const [slideMovies, setSlideMovies] = useState([]); // 슬라이드쇼 영화 정보
  const [selectedGenre, setSelectedGenre] = useState("All"); // 선택된 장르 상태 추가
  const [page, setPage] = useState(1); // 현재 페이지
  // 초기값을 true로 설정하여 검색 모드 진입(또는 새로고침) 즉시 무한스크롤 Observer가 붙도록 준비
  const [hasMore, setHasMore] = useState(true); // 더 불러올 영화가 있는지 여부
  const [loadingMore, setLoadingMore] = useState(false); // 중복 fetch 방지용
  const windowSize = useWindowSize(); // 커스텀 훅을 통해 창 크기 정보 가져오기
  const scrollRef = useRef(null); // 스크롤 감지용
  const observer = useRef(null);
  const loaderRef = useCallback(
    (node) => {
      // 이전 observer가 있으면 해제
      if (observer.current) observer.current.disconnect(); // 타켓 요소 관찰 중지
      // node가 마운트됐고, 필터링 중이며, 더 불러올 게 있으면
      if (node && isFiltering && hasMore) {
        observer.current = new IntersectionObserver(
          (entries) => {
            // 교차하면 page 상태를 증가시켜 다음 페이지 요청
            if (entries[0].isIntersecting) setPage((prev) => prev + 1);
          },
          { root: scrollRef.current, threshold: 0.1 }
        );
        observer.current.observe(node); // 타켓 요소 관찰 시작
      }
    },
    [isFiltering, hasMore]
  );

  // 영화 데이터 요청 (장르별 메인화면 표시용)
  const getMovieByGenres = async () => {
    setLoading(true);
    const newMoviesByGenre = {};
    const url = new URL("https://yts.mx/api/v2/list_movies.json?");

    for (const config of genreConfigs) {
      url.searchParams.set("genre", config.genre);
      url.searchParams.set("limit", 18);
      const response = await fetch(url.toString());
      const json = await response.json();

      newMoviesByGenre[config.genre] = {
        movies: json.data.movies || [],
        icon: config.icon,
      };
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
  const getFilteredMovies = async (pageNum = 1) => {
    if (loadingMore) return; // 중복 요청 방지
    try {
      setLoadingMore(true);
      const url = new URL("https://yts.mx/api/v2/list_movies.json?");
      const genre = searchParams.get("genre");
      const query = searchParams.get("query_term");

      if (genre && genre !== "All") url.searchParams.set("genre", genre);
      if (query) url.searchParams.set("query_term", query);
      url.searchParams.set("page", pageNum);
      url.searchParams.set("limit", 20);

      const response = await fetch(url.toString());
      const json = await response.json();
      const newMovies = json.data.movies ? json.data.movies : [];

      // 1페에지만 데이터 초기화, 그 외엔 누적
      setFilteredMovies((prevMovies) =>
        pageNum === 1 ? newMovies : [...(prevMovies || []), ...newMovies]
      );
      // 다음 페이지 더 올 수 있는지 체크
      setHasMore(newMovies.length === 20);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("영화 데이터를 불러오는 중 오류 발생:", error);
      }
    } finally {
      setLoadingMore(false); // 로딩 상태 해제
    }
  };

  // 검색/장르 파라미터 변화 시
  useEffect(() => {
    const genre = searchParams.get("genre");
    const query = searchParams.get("query_term");
    if (genre || query) {
      setIsFiltering(true); // 필터링 모드 활성화
      setPage(1); // 페이지 초기화
      setHasMore(true); // 무한스크롤 재시작을 위해 true 설정
      setFilteredMovies(null); // 기존 검색 결과 초기화
      getFilteredMovies(1); // 첫 페이지 데이터 요청
    } else {
      setIsFiltering(false); // 필터링 모드 종료
      setFilteredMovies(null); // 결과 초기화
    }
  }, [searchParams]);

  // 최초 로드 시 영화 데이터 요청
  useEffect(() => {
    getMovieByGenres();
    getSlideMovies();
  }, []);

  // 옵저버 정리
  useEffect(() => {
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);

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
  useEffect(() => {
    const trimmed = debouncedSearchTerm?.trim();
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      if (trimmed) {
        newParams.set("query_term", trimmed);
      } else {
        newParams.delete("query_term");
      }
      return newParams;
    });
  }, [debouncedSearchTerm]);

  // 검색결과 페이지 변경시 영화 데이터 요청
  useEffect(() => {
    if (page > 1) getFilteredMovies(page);
  }, [page]);

  // URL의 genre 파라미터가 변경될 때 selectedGenre 상태를 동기화
  // ex) 뒤로가기 버튼
  useEffect(() => {
    const genre = searchParams.get("genre") || "All";
    setSelectedGenre(genre);
  }, [searchParams]);

  return (
    <div ref={scrollRef} className={styles.homePagecontainer}>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div>
          <div className={styles.filterContainer}>
            <GenreMenu
              genreList={GENRE_LIST}
              selectedGenre={selectedGenre}
              onSelectGenre={handleGenreChange}
            />
            {/* 제목 검색창 */}
            <SearchBar
              searchTerm={searchTerm}
              onSearch={setSearchTerm}
              onClear={() => {
                setSearchTerm("");
                searchInputRef.current && (searchInputRef.current.value = "");
              }}
              ref={searchInputRef}
            />
          </div>
          {/* 슬라이드 쇼 */}
          {isFiltering ? null : <SlideShow movies={slideMovies} />}

          {/* 영화 목록 */}
          {isFiltering ? (
            <div className={styles.gridContainer}>
              {/* (1) 검색 결과 */}
              {(filteredMovies || []).map((movie) => (
                <Movie
                  key={movie.id}
                  id={movie.id}
                  coverImg={movie.medium_cover_image}
                  title={movie.title}
                  genres={movie.genres}
                  showOverlay
                />
              ))}

              {/* (2) 검색 결과 0건 */}
              {filteredMovies !== null && filteredMovies.length === 0 && (
                <p className={styles.noResult}>No movie found.</p>
              )}

              {/* (3) 무한 스크롤 로더 */}
              {hasMore && (
                <div ref={loaderRef} className={styles.loader}>
                  {filteredMovies === null ? "Loading…" : "Loading more…"}
                </div>
              )}
            </div>
          ) : (
            <div className={styles.sliderListContainer}>
              {Object.entries(moviesByGenre).map(
                ([genre, { movies, icon }]) => (
                  <CategorySlider
                    key={genre}
                    genre={genre}
                    movies={movies}
                    movieIcon={icon}
                  />
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
