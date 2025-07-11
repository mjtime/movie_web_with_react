import styles from "./SearchBar.module.css";
import React, { forwardRef } from "react";

const SearchBar = forwardRef(function SearchBar(
  { searchTerm, onSearch, onClear },
  ref
) {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className={styles.searchContainer}
    >
      <span className={styles.iconSearch}>🔍</span>
      <input
        ref={ref}
        type="text"
        name="query_term"
        placeholder="movie title"
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()} // 엔터키 입력 방지
        className={styles.searchInput}
      />
      {searchTerm && (
        <button onClick={onClear} className={styles.clearButton}>
          X
        </button>
      )}
    </form>
  );
});

export default SearchBar;
