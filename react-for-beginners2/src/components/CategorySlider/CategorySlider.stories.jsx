import React, { useState, useEffect } from "react";
import { MemoryRouter } from "react-router-dom";
import CategorySlider from "./CategorySlider";

const MOVIES_URL = "https://yts.mx/api/v2/list_movies_12.json";

function SliderWrapper({ genre }) {
  const [movies, setMovies] = useState([]);

  // 영화 데이터 로드
  useEffect(() => {
    fetch(MOVIES_URL)
      .then((res) => res.json())
      .then((json) => setMovies(json.data.movies || []));
  }, []);

  return <CategorySlider genre={genre} movies={movies} />;
}

export default {
  title: "Components/CategorySlider",
  component: CategorySlider,
  decorators: [(storyFn) => <MemoryRouter>{storyFn()}</MemoryRouter>],
};

export const Default = {
  render: () => <SliderWrapper genre="Action" />,
};
