// src/components/SlideShow/SlideShow.stories.jsx
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { initialize, mswDecorator } from "msw-storybook-addon";
import SlideShow from "./SlideShow";

// 2) default export 에 데코레이터 & argTypes 설정
export default {
  title: "Components/SlideShow",
  component: SlideShow,
  // 먼저 MSW를 켜고, 그 다음에 라우터 데코레이터를 겹칩니다.
  decorators: [
    mswDecorator,
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

// 3) 템플릿 함수 (args를 받아 컴포넌트 렌더)
const Template = (args, { loaded }) => (
  <SlideShow {...args} movies={loaded?.movies || []} />
);

// 4) 실제 스토리 정의
export const Default = Template.bind({});
Default.loaders = [
  async () => {
    const res = await fetch(
      "https://yts.mx/api/v2/list_movies.json?sort_by=rating&limit=5"
    );
    const json = await res.json();
    return { movies: json.data.movies };
  },
];
