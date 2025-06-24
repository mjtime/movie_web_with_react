import React from "react";
import { fn } from "storybook/test";
import SearchBar from "./SearchBar";

export default {
  title: "Components/SearchBar",
  component: SearchBar,
};

export const Default = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  return (
    <SearchBar
      searchTerm={searchTerm}
      onSearch={fn(setSearchTerm)}
      onClear={fn(() => setSearchTerm(""))}
    />
  );
};
