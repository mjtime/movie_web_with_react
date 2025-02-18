import PropTypes from "prop-types";
import { Link } from "react-router-dom";
function Movie({ id, coverImg, title, summary, genres }) {
  return (
    <div
      style={{
        flex: "0 0 160px", // 가로 크기 고정
        minHeight: "300px", // 타이틀, 장르 포함한 전체 높이
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <img
        src={coverImg}
        alt={title}
        style={{
          width: "100%",
          height: "auto", // 포스터 비율 유지
          objectFit: "cover",
        }}
      />
      <h2 style={{ fontSize: "14px", margin: "5px 0" }}>
        <Link to={`/movie/${id}`}>{title}</Link>
      </h2>
      <p style={{ fontSize: "12px", maxHeight: "60px", overflow: "hidden" }}>
        {summary}
      </p>
      <ul style={{ fontSize: "12px", padding: 0, listStyle: "none" }}>
        {genres.map((g) => (
          <li key={g}>{g}</li>
        ))}
      </ul>
    </div>
  );
}

Movie.propTypes = {
  id: PropTypes.number.isRequired,
  coverImg: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  genres: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Movie;
