import React from "react";
import { fn } from "storybook/test";
import GenreMenu from "./GenreMenu";
import { GENRE_LIST } from "contents/genres";

export default {
  title: "Components/GenreMenu",
  component: GenreMenu,
};

export const Default = () => {
  const [selectedGenre, setSelectedGenre] = React.useState("All");
  return (
    <GenreMenu
      genreList={GENRE_LIST}
      selectedGenre={selectedGenre}
      onSelectGenre={fn(setSelectedGenre)}
    />
  );
};
