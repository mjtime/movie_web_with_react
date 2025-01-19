import { useState, useEffect } from "react";
import Movie from "../components/Movie";
import { useSearchParams } from "react-router-dom";

function Home() {
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [movies, setMovies] = useState([]); // 영화 정보
  const [searchParams, setSearchParams] = useSearchParams();

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

  const getMovies = async () => {
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
      setMovies(json.data.movies);
    } else {
      setMovies([]); // 데이터가 없다면 빈 배열로 설정
    }

    setLoading(false); // 로딩 완료
    // console.log(movies);  // 영화들 정보 확인용
  };

  useEffect(() => {
    getMovies();
  }, [searchParams]); // searchParams가 변경될 때마다 getMovies 호출

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
        newParams.set("query_term", query);
      } else {
        newParams.delete("query_term"); // 검색어 없을시 제거
      }
      return newParams;
    });
  };

  return (
    <div>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div>
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
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              nams="query_term"
              placeholder="movie title"
              defaultValue={searchParams.get("query_term") || ""}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </form>
          {/* 영화 목록 */}
          {movies.length > 0 ? (
            movies.map((movie) => (
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
      )}
    </div>
  );
}

export default Home;
