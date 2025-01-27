import { useState, useEffect, useRef } from "react";

function SlideShow({ movies }) {
  const [currentSlide, setCurrentSlide] = useState(1); // 슬라이드 인덱스 (중앙부터 시작)
  const [transitioning, setTransitioning] = useState(false); // 애니메이션 상태
  const intervalId = useRef(null);

  // 자연스러운 슬라이드 효과 적용을 위해 양쪽 끝에 복제
  const slides = [
    movies[movies.length - 1], // 마지막 슬라이드 복제
    ...movies,
    movies[0], // 첫 번째 슬라이드 복제
  ];

  // 슬라이드 자동 진행
  useEffect(() => {
    startAutoSlide();

    // visibilitychange 이벤트 추가
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAutoSlide(); // 탭이 비활성화되면 슬라이드쇼 멈춤
      } else {
        resetSlideShow(); // 탭이 활성화되면 슬라이드쇼 복구
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopAutoSlide(); // 컴포넌트 언마운트 시 인터벌 정리
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const startAutoSlide = () => {
    stopAutoSlide(); // 기존 인터벌 제거
    intervalId.current = setInterval(() => {
      nextSlide();
    }, 3000);
  };

  const stopAutoSlide = () => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
    }
  };

  const resetSlideShow = () => {
    startAutoSlide(); // 슬라이드쇼 다시 시작
  };

  const nextSlide = () => {
    if (!transitioning) {
      setCurrentSlide((prev) => prev + 1); // 슬라이드 인덱스 증가
      setTransitioning(true); // 슬라이드 애니메이션 실행
    }
  };

  // 인덱스가 변할때 마다 호출, 실질적인 적용은 인덱스가 끝에 도달한 경우
  const handleTransitionEnd = () => {
    setTransitioning(false); // 슬라이드 애니메이션 일시적 종료

    //양쪽 끝에 도달한 경우 transition 스타일이 적용되지 않으므로, 시각적으로 즉시 이동
    // 오른쪽 끝에 도달한 경우
    if (currentSlide === slides.length - 1) {
      setCurrentSlide(1); // 첫 번째 슬라이드로 이동
    }
    // 왼쪽 끝에 도달한 경우
    if (currentSlide === 0) {
      setCurrentSlide(slides.length - 2); // 마지막 슬라이드로 이동
    }
  };

  return (
    <div
      style={{
        position: "relative",
        height: "400px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          transform: `translateX(${-currentSlide * 100}%)`,
          transition: transitioning ? "transform 0.5s ease-in-out" : "none",
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {slides.map((movie, index) => (
          <div
            key={index}
            style={{
              minWidth: "100%",
              height: "400px",
              backgroundImage: `url(${movie.background_image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(0,0,0,0.5)",
                padding: "20px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                color: "white",
              }}
            >
              <h2>{movie.title}</h2>
              <p>{movie.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SlideShow;
