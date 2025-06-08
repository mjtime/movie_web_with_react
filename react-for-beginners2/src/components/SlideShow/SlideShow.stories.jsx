// src/components/SlideShow/SlideShow.stories.jsx
import React from "react";
import { MemoryRouter } from "react-router-dom";
import SlideShow from "./SlideShow";

const createLoader = (url) => [
  async () => {
    const res = await fetch(url);
    const json = await res.json();
    return { movies: json.data.movies };
  },
];
const renderWithMovies = (args, { loaded: { movies } }) => (
  <SlideShow {...args} movies={movies} />
);

export default {
  title: "Components/SlideShow",
  component: SlideShow,
  decorators: [(storyFn) => <MemoryRouter>{storyFn()}</MemoryRouter>],
};

export const Default = {
  loaders: createLoader(
    "https://yts.mx/api/v2/list_movies.json?sort_by=rating&limit=5"
  ),
  args: { movies: [] },
  render: renderWithMovies,
};

export const NoImages = {
  loaders: createLoader("https://yts.mx/api/v2/list_movies_no_images.json"),
  args: { movies: [] },
  render: renderWithMovies,
};
