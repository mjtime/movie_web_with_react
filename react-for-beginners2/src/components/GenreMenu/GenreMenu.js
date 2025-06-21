import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./GenreMenu.module.css";
import useWindowSize from "hooks/useWindowSize";

function GenreMenu({ genreList, selectedGenre, onSelectGenre }) {
  const [menuEl, setMenuEl] = useState(null); // 장르 메뉴 가로스크롤 대상
  const [isGenreMenuOpen, setIsGenreMenuOpen] = useState(false); // 장르 메뉴 열림 상태
  const [genreDropdownStyle, setGenreDropdownStyle] = useState({}); // 장르 메뉴 드롭다운 위치 설정
  const genreMenuContainerRef = useRef(null); //DOM 요소에 직접 접근할 때 사용하는 ref (위치 계산용)
  const [isMouseOverGenreMenuBtn, setIsMouseOverGenreMenuBtn] = useState(false); // 장르 드롭다운 버튼 마우스 오버 상태
  const [isMouseOverGenreDropdown, setIsMouseOverGenreDropdown] =
    useState(false); // 장르 드롭다운 창 마우스 오버 상태
  const windowSize = useWindowSize(); // 커스텀 훅을 통해 창 크기 정보 가져오기

  // ref와 state를 동시에 설정하는 콜백 함수
  // - ref는 드롭다운 위치 계산용
  // - state는 useEffect에서 감지되어 가로 스크롤 이벤트를 등록하기 위한 용도
  const genreMenuRef = (element) => {
    // useRef
    genreMenuContainerRef.current = element;
    // useState
    setMenuEl(element);
  };

  // 드롭다운 위치 갱신 (창 크기 변경 또는 열릴 때마다)
  useEffect(() => {
    if (genreMenuContainerRef.current) {
      const rect = genreMenuContainerRef.current.getBoundingClientRect();
      setGenreDropdownStyle({
        position: "absolute",
        top: rect.top + "px",
        left: rect.left + "px",
        width: rect.width + "px",
        zIndex: 1000,
      });
    }
  }, [isGenreMenuOpen, windowSize]);

  // 장르 메뉴 열기/닫기
  useEffect(() => {
    // 마우스가 버튼 또는 드롭다운 위에 있을 때만 메뉴 표시
    if (isMouseOverGenreMenuBtn || isMouseOverGenreDropdown) {
      setIsGenreMenuOpen(true);
    } else {
      setIsGenreMenuOpen(false);
    }
  }, [isMouseOverGenreMenuBtn, isMouseOverGenreDropdown]);

  // 휠 이벤트로 가로 스크롤 적용
  useEffect(() => {
    if (!menuEl) return; // menuEl이 아직 설정되지 않았다면 종료
    const handleWheel = (e) => {
      e.preventDefault(); // 세로 스크롤 방지
      // 가로 스크롤
      menuEl.scrollBy({
        left: e.deltaY, // 세로 스크롤 양을 가로 스크롤로 변환
        behavior: "smooth",
      });
    };

    // passive: false 옵션을 주어 브라우저가 이벤트의 preventDefault 호출을 인지
    menuEl.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      menuEl.removeEventListener("wheel", handleWheel);
    };
  }, [menuEl]);

  // 마우스 드래그로 가로 스크롤
  useEffect(() => {
    if (!menuEl) return;

    let isDown = false; // 클릭 상태
    let startX;
    let scrollLeft;

    const mouseDownHandler = (e) => {
      isDown = true;
      // 드래그 시작 위치를 저장
      startX = e.pageX - menuEl.offsetLeft;
      scrollLeft = menuEl.scrollLeft;
    };

    const mouseLeaveHandler = () => {
      isDown = false;
    };

    const mouseUpHandler = () => {
      isDown = false;
    };

    const mouseMoveHandler = (e) => {
      if (!isDown) return;
      e.preventDefault();
      // 현재 마우스 위치와 시작 위치의 차이를 계산
      const x = e.pageX - menuEl.offsetLeft;
      const walk = (x - startX) * 1; // 스크롤 속도 조절
      menuEl.scrollLeft = scrollLeft - walk;
    };

    menuEl.addEventListener("mousedown", mouseDownHandler);
    menuEl.addEventListener("mouseleave", mouseLeaveHandler);
    menuEl.addEventListener("mouseup", mouseUpHandler);
    menuEl.addEventListener("mousemove", mouseMoveHandler);

    return () => {
      menuEl.removeEventListener("mousedown", mouseDownHandler);
      menuEl.removeEventListener("mouseleave", mouseLeaveHandler);
      menuEl.removeEventListener("mouseup", mouseUpHandler);
      menuEl.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, [menuEl]);

  return (
    <div className={styles.menuContainer}>
      {/* 장르 메뉴 드롭다운 토글 버튼 */}
      <button
        className={styles.genre_toggle_btn}
        onMouseEnter={() => setIsMouseOverGenreMenuBtn(true)}
        onMouseLeave={() => setIsMouseOverGenreMenuBtn(false)}
      >
        +
      </button>
      {/* 장르 메뉴 */}
      <ul ref={genreMenuRef} className={styles.genreMenu}>
        {genreList.map((genres_category) => (
          <li key={genres_category}>
            <button
              onClick={() => onSelectGenre(genres_category)}
              className={
                selectedGenre === genres_category ? styles.selectedGenre : ""
              }
            >
              {genres_category}
            </button>
          </li>
        ))}
      </ul>

      {/* Portal을 이용해 .body에 드롭다운 메뉴 렌더링 */}
      {createPortal(
        <div
          className={`${styles.dropdownGenresMenu} ${
            isGenreMenuOpen ? styles.open : ""
          }`}
          style={genreDropdownStyle}
          onMouseEnter={() => setIsMouseOverGenreDropdown(true)}
          onMouseLeave={() => setIsMouseOverGenreDropdown(false)}
        >
          {genreList.map((genre) => (
            <button
              key={genre}
              onClick={() => {
                onSelectGenre(genre);
                setIsGenreMenuOpen(false);
              }}
              className={selectedGenre === genre ? styles.selectedGenre : ""}
            >
              {genre}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}
export default GenreMenu;
