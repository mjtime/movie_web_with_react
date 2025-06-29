// src/components/Movie/Movie.stories.jsx
import React from "react";
import { MemoryRouter } from "react-router-dom";
import Movie from "./Movie";

export default {
  title: "Components/Movie",
  component: Movie,
  decorators: [(storyFn) => <MemoryRouter>{storyFn()}</MemoryRouter>],
};

export const nullImg = {
  args: {
    id: 1,
    coverImg: null, // 빈 문자열로 에러 시도
    title: "Null coverImg",
    genres: ["Action"],
  },
  render: (args) => <Movie {...args} />,
};
export const emptyStrImg = {
  args: {
    id: 2,
    coverImg: "", // 빈 문자열로 에러 시도
    title: "empty coverImg",
    summary: "Movie summary",
    genres: ["Action"],
  },
  render: (args) => <Movie {...args} />,
};
export const img400 = {
  args: {
    id: 3,
    coverImg: "mock-images/poster1.jpg", // 유효한 이미지 URL
    title: "400 Img",
    genres: ["Action"],
  },
  render: (args) => <Movie {...args} />,
};
