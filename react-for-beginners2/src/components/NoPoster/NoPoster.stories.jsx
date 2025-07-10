import React from "react";
import NoPoster from "./NoPoster";

// 1) 기본 export: 메타 정보
export default {
  title: "Components/NoPoster", // 사이드바에 표시될 위치
  component: NoPoster, // 이 스토리가 다룰 컴포넌트
};

// 2) 이름 있는 export: 스토리
export const Default = () => <NoPoster title="No Image Available" />;
export const LongTitleWithoutSpaces = () => (
  <NoPoster title="NoImageAvailableNoImageAvailableNoImageAvailableNoImageAvailableNoImageAvailableNoImageAvailableNoImageAvailable" />
);
