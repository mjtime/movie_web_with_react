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
    console.log(genre);
    if (genre && genre !== "All") {
      url.searchParams.set("genre", genre);
    }

    // API 요청
    const response = await fetch(url.toString());
    const json = await response.json();

    setMovies(json.data.movies);
    setLoading(false);
    console.log(movies);
  };

  useEffect(() => {
    getMovies();
  }, [searchParams]); // searchParams가 변경될 때마다 getMovies 호출

  // SearchParams에 장르 카테고리 변경사항 적용
  const handleGenreChange = (genre) => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      if (genre === "All") {
        newParams.delete("genre"); // 장르 전체 선택시 장르 필터 제거
      } else {
        newParams.set("genre", genre); // 정렬기준이 될 장르로 설정
      }
      return newParams;
    });
  };

  // console.log(searchParams); // url 쿼리 확인용
  return (
    <div>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div>
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
      )}
    </div>
  );
}

export default Home;
