import { useState, useEffect, useRef } from "react";
import Movie from "../components/Movie";
import SlideShow from "../components/SlideShow";
import { useSearchParams } from "react-router-dom";
import styles from "./Home.module.css";

function Home() {
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [moviesByGenre, setMoviesByGenre] = useState({}); // 메인에 출력될 장르별 영화 정보
  const [filteredMovies, setFilteredMovies] = useState([]); // 검색된 영화들 정보
  const [isFiltering, setIsFiltering] = useState(false); // 필터링 상태
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInputRef = useRef(null); // 검색창 연결
  const [slideMovies, setSlideMovies] = useState([]); // 슬라이드할 영화들 정보

  // 장르 정보 하드코딩
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

  // **메인페이지에 기본적**으로 출력할 장르별 영화들 요청
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
      url.searchParams.set("limit", 10);
      const response = await fetch(url.toString());
      const json = await response.json();

      if (json.data.movies) {
        newMoviesByGenre[genre] = json.data.movies;
      } else {
        newMoviesByGenre[genre] = [];
      }
    }

    setMoviesByGenre(newMoviesByGenre);
    setLoading(false);

    // console.log(moviesByGenre); // moviesByGenre 확인용
  };

  // **슬라이드** 할 영화들 정보 가져오기
  const getSlideMovies = async () => {
    setLoading(true);
    const url = new URL("https://yts.mx/api/v2/list_movies.json?");
    url.searchParams.set("sort_by", "rating");
    url.searchParams.set("limit", 5);

    const response = await fetch(url.toString());
    const json = await response.json();

    if (json.data.movies) {
      setSlideMovies(json.data.movies);
    }
    setLoading(false);
  };

  // **장르, 영화 제목 검색시** 영화 정보들 가져오기
  const getFilteredMovies = async () => {
    // url 객체 생성
    const url = new URL("https://yts.mx/api/v2/list_movies.json?");

    // 장르 필터 추가
    const genre = searchParams.get("genre");
    if (genre && genre !== "All") {
      url.searchParams.set("genre", genre);
    }

    // 영화 제목 필터 추가
    const query = searchParams.get("query_term");
    if (query) {
      url.searchParams.set("query_term", query);
    }

    console.log(url.toString()); // url 확인용

    // API 요청
    const response = await fetch(url.toString());
    const json = await response.json();

    // 데이터 검증
    if (json.data.movies) {
      setFilteredMovies(json.data.movies);
    } else {
      setFilteredMovies([]); // 데이터가 없다면 빈 배열로 설정
    }

    // console.log(movies);  // 영화들 정보 확인용
  };

  // 검색 필터링시 영화들 정보 로드
  useEffect(() => {
    const genre = searchParams.get("genre");
    const query = searchParams.get("query_term");

    if (genre || query) {
      // 영화 검색 또는 장르 선택하여 검색할 시
      setIsFiltering(true);
      getFilteredMovies();
    } else {
      setIsFiltering(false); // 메인 화면 띄우기
    }
  }, [searchParams]); // searchParams가 변경될 때마다 getFilteredMovies 호출

  // 접속시 최소 1회 메인에 출력할 영화들 정보 로드
  useEffect(() => {
    getMovieByGenres();
    getSlideMovies();
  }, []);

  // SearchParams에 장르 카테고리 변경사항 적용
  const handleGenreChange = (genre) => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      if (genre === "All") {
        newParams.delete("genre"); // 장르 All 선택시 장르 필터 제거
      } else {
        newParams.set("genre", genre); // 정렬 기준이 될 장르로 설정
      }
      return newParams;
    });
  };

  // SearchParams에 검색창 입력시 변경사항 적용
  const handleSearch = (query) => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      if (query) {
        newParams.set("query_term", query); // 검색어에서 기존에 입력된 내용 제거
      } else {
        newParams.delete("query_term"); // 검색어 없을시 제거
      }
      return newParams;
    });
  };

  // 검색창 clear 버튼
  const clearSearch = () => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.delete("query_term"); // 검색어에서 기존에 입력된 내용 제거
      return newParams;
    });
    if (searchInputRef.current) {
      searchInputRef.current.value = ""; // input에 남아있는 value 제거
    }
  };

  return (
    <div>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div>
          {/*슬라이드 쇼*/}
          <SlideShow movies={slideMovies} />

          {/* 장르 선택 버튼 */}
          <div>
            <ul>
              {genre_list.map((genres_category) => (
                <li key={genres_category}>
                  <button onClick={() => handleGenreChange(genres_category)}>
                    {genres_category}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {/*제목 검색창, onSubmit 새로고침 방지, 실시간 검색*/}
          <form
            onSubmit={(e) => e.preventDefault()}
            className={styles.searchContainer}
          >
            <input
              type="text"
              name="query_term"
              placeholder="movie title"
              defaultValue={searchParams.get("query_term") || ""}
              onChange={(e) => handleSearch(e.target.value)}
              ref={searchInputRef}
              className={styles.searchInput}
            />
            {/* clear button, 검색어가 존재할 시에만 활성화 */}
            {searchInputRef.current && searchInputRef.current.value && (
              <button onClick={clearSearch} className={styles.clearButton}>
                X
              </button>
            )}
          </form>
          {/* 영화 목록 */}
          {isFiltering ? (
            /* 선택된 장르, 검색된 영화 정보 출력 */
            <div>
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
            /* 기본 메인 영화 정보 출력 */
            Object.entries(moviesByGenre).map(([genre, movies]) => (
              <div key={genre}>
                <h2>{genre}</h2>
                <div style={{ display: "flex", overflowX: "scroll" }}>
                  {movies.map((movie) => (
                    <Movie
                      key={movie.id}
                      id={movie.id}
                      coverImg={movie.medium_cover_image}
                      title={movie.title}
                      summary={movie.summary}
                      genres={movie.genres}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
