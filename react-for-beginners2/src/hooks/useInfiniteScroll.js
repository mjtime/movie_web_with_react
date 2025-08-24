import { useState, useRef, useEffect, useCallback } from "react";

/**
 * useInfiniteScroll
 * @param {Object} params
 * @param {boolean} params.isActive - 무한스크롤 활성화 여부 (ex: 검색중)
 * @param {boolean} params.hasMore - 다음 페이지가 있는지 여부
 * @param {Function} params.onLoadMore - 다음 페이지 로드 콜백
 * @param {Element|Ref|null} params.root - IntersectionObserver root (DOM element, ref obj, 또는 null)
 * @param {string} params.rootMargin -  관찰 영역 마진, root 기준으로 얼마나 여유를 둘지 지정 ("0px", "100px" 등)
 * @param {number|number[]} params.threshold - 얼마나 교차하면 콜백을 실행할지 지정 (0~1)
 *
 * 사용:
 * const loaderRef = useInfiniteScroll({isActive, hasMore, onLoadMore, root: scrollRef});
 */
export default function useInfiniteScroll({
  isActive = true,
  hasMore = true,
  onLoadMore,
  root = null,
  rootMargin = "0px",
  threshold = 0.1,
}) {
  const [node, setNode] = useState(null); // 관찰할 DOM 노드
  const observerRef = useRef(null); // 현재 observer 저장
  const onLoadMoreRef = useRef(onLoadMore); // 최신 onLoadMore 참조 저장

  // 항상 최신 onLoadMore를 ref에 저장 (클로저 문제 방지)
  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  // 관찰할 노드가 바뀌거나, isActive/hasMore/root 옵션이 바뀌면 observer 재설정
  useEffect(() => {
    // 조건이 안 맞으면 아무 것도 하지 않고 있던 observer만 해제
    if (!node || !isActive || !hasMore) {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      return;
    }

    const rootEl =
      typeof root === "object" && root?.current ? root.current : root ?? null;

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          // 항상 최신 콜백 호출
          onLoadMoreRef.current && onLoadMoreRef.current();
        }
      },
      { root: rootEl, rootMargin, threshold }
    );

    obs.observe(node);
    observerRef.current = obs;

    return () => {
      obs.disconnect();
      if (observerRef.current === obs) observerRef.current = null;
    };
  }, [node, isActive, hasMore, root, rootMargin, threshold]);

  // 언마운트 시 안전하게 해제
  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  // ref 콜백은 불변(메모이제이션) — 단순히 node state를 바꿔줌
  const loaderRef = useCallback((el) => {
    setNode(el);
  }, []);

  return loaderRef;
}
