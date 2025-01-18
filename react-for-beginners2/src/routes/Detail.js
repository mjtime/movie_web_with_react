import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Detail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
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
    <div>
      {movie ? ( // 불러오는 동안 값 없어서 에러 발생 방지
        <div>
          <h2>{movie.title}</h2>
          <img src={movie.medium_cover_image} />
          <p>{movie.year}</p>
          <p>{movie.language}</p>
          <p>{movie.rating}</p>
          <p>{movie.runtime}</p>
          <p>
            {movie.genres.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </p>
          <p>{movie.like_count}</p>
          <img src={movie.background_image} />
          <p>{movie.description_intro}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Detail;
