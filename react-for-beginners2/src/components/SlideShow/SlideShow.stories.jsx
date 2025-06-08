// src/components/SlideShow/SlideShow.stories.jsx
import React from "react";
import { MemoryRouter } from "react-router-dom";
import SlideShow from "./SlideShow";

export default {
  title: "Components/SlideShow",
  component: SlideShow,
  decorators: [(storyFn) => <MemoryRouter>{storyFn()}</MemoryRouter>],
};

// Default 스토리
export const Default = {
  loaders: [
    async () => {
      const res = await fetch(
        "https://yts.mx/api/v2/list_movies.json?sort_by=rating&limit=5"
      );
      const json = await res.json();
      return { movies: json.data.movies };
    },
  ],
  args: {
    movies: [], // 로더 실행 전 기본값
  },
  render: (args, { loaded: { movies } }) => (
    <SlideShow {...args} movies={movies} />
  ),
};

// NoImages 스토리 (포스터, 배경 이미지 없는 경우)
export const NoImages = {
  loaders: [
    async () => {
      const res = await fetch(
        "https://yts.mx/api/v2/list_movies_no_images.json"
      );
      const json = await res.json();
      return { movies: json.data.movies };
    },
  ],
  args: {
    movies: [],
  },
  render: (args, { loaded: { movies } }) => (
    <SlideShow {...args} movies={movies} />
  ),
};
