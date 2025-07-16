import { useState, useEffect, useRef } from "react";
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

function Home() {
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [moviesByGenre, setMoviesByGenre] = useState({}); // 장르별 영화 정보
  const [filteredMovies, setFilteredMovies] = useState([]); // 검색된 영화 정보
  const [isFiltering, setIsFiltering] = useState(false); // 필터링 상태
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInputRef = useRef(null); // 검색창 연결
  const [slideMovies, setSlideMovies] = useState([]); // 슬라이드쇼 영화 정보
  const [selectedGenre, setSelectedGenre] = useState("All"); // 선택된 장르 상태 추가
  const windowSize = useWindowSize(); // 커스텀 훅을 통해 창 크기 정보 가져오기

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

  // 검색/장르 파라미터 변화 시
  useEffect(() => {
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

  useEffect(() => {
    const genre = searchParams.get("genre") || "All";
    setSelectedGenre(genre);
  }, [searchParams]);

  return (
    <div className={styles.homePagecontainer}>
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
              searchTerm={searchParams.get("query_term") || ""}
              onSearch={handleSearch}
              onClear={clearSearch}
              ref={searchInputRef}
            />
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
                    genres={movie.genres}
                    showOverlay
                  />
                ))
              ) : (
                <p>No movie found.</p>
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
