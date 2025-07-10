// src/mocks/handlers.js
import { http, HttpResponse } from "msw";

export const handlers = [
  // 기본 핸들러
  http.get(/https:\/\/yts\.mx\/api\/v2\/list_movies\.json.*/, () =>
    HttpResponse.json({
      data: {
        movies: [
          {
            id: 1,
            title: "Movie title 1",
            background_image: "mock-images/bg1.jpg",
            medium_cover_image: "mock-images/poster1.jpg",
            summary:
              "영화 요약 공간 영화 요약 공간 영화 요약 공간 영화 요약 공간 영화 요약 공간 영화 요약 공간 영화 요약 공간 영화 요약 공간 영화 요약 공간 영화 요약 공간 영화 요약 공간 영화 요약 공간 영화 요약 공간 ",
            rating: 0.1,
          },
          {
            id: 2,
            title: "Movie title 2",
            background_image: "mock-images/bg2.jpg",
            medium_cover_image: "mock-images/poster2.jpg",
            summary: "",
            rating: 8.7,
          },
          {
            id: 3,
            title: "Movie title 3",
            background_image: "mock-images/bg3.jpg",
            medium_cover_image: "mock-images/poster3.jpg",
            summary: "요약3",
            rating: 10.0,
          },
        ],
      },
    })
  ),

  // 포스터와 배경 이미지가 없는 영화 핸들러
  http.get(/https:\/\/yts\.mx\/api\/v2\/list_movies_no_images\.json.*/, () =>
    HttpResponse.json({
      data: {
        movies: [
          {
            id: 10,
            title: "Movie without images 1",
            background_image: null, // 또는 빈 문자열
            medium_cover_image: null,
            summary: "포스터/배경 없는 영화 1 - null 값인 경우",
            rating: 5.5,
          },
          {
            id: 11,
            title: "Movie without images 2",
            background_image: "",
            medium_cover_image: "",
            summary: "포스터/배경 없는 영화 2 - 빈 문자열인 경우",
            rating: 7.0,
          },
        ],
      },
    })
  ),

  // 영화 정보 12개
  http.get(/https:\/\/yts\.mx\/api\/v2\/list_movies_12\.json.*/, () =>
    HttpResponse.json({
      data: {
        movies: [
          {
            id: 1,
            title: "Movie title 1",
            background_image: "mock-images/bg1.jpg",
            medium_cover_image: "mock-images/poster1.jpg",
            summary:
              "영화 요약 공간 영화 요약 공간 영화 요약 공간 영화 요약 공간 영화 요약 공간 영화 요약 공간 영화 요약 공간 영화 요약 공간 영화 요약 공간 영화 요약 공간 영화 요약 공간 영화 요약 공간 영화 요약 공간 ",
            rating: 0.1,
          },
          {
            id: 2,
            title: "Movie title 2",
            background_image: "mock-images/bg2.jpg",
            medium_cover_image: "mock-images/poster2.jpg",
            summary: "",
            rating: 8.7,
          },
          {
            id: 3,
            title: "123456789012345678901234567890",
            background_image: null,
            medium_cover_image: null,
            summary: "포스터/배경 없는 영화 1 - null 값인 경우",
            rating: 5.5,
          },
          {
            id: 4,
            title: "Movie title 3",
            background_image: "mock-images/bg3.jpg",
            medium_cover_image: "mock-images/poster3.jpg",
            summary: "요약",
            rating: 10.0,
          },

          {
            id: 5,
            title: "Movie title 1",
            background_image: "mock-images/bg1.jpg",
            medium_cover_image: "mock-images/poster1.jpg",
            summary: "",
            rating: 0.1,
          },
          {
            id: 6,
            title: "Movie title 2",
            background_image: "mock-images/bg2.jpg",
            medium_cover_image: "mock-images/poster2.jpg",
            summary: "",
            rating: 8.7,
          },
          {
            id: 7,
            title: "Movie title 3",
            background_image: "mock-images/bg3.jpg",
            medium_cover_image: "mock-images/poster3.jpg",
            summary: "요약",
            rating: 10.0,
          },
          {
            id: 8,
            title: "Movie title 1",
            background_image: "mock-images/bg1.jpg",
            medium_cover_image: "mock-images/poster1.jpg",
            summary: "",
            rating: 0.1,
          },
          {
            id: 9,
            title: "Movie title 2",
            background_image: "mock-images/bg2.jpg",
            medium_cover_image: "mock-images/poster2.jpg",
            summary: "",
            rating: 8.7,
          },
          {
            id: 10,
            title: "Movie title 3",
            background_image: "mock-images/bg3.jpg",
            medium_cover_image: "mock-images/poster3.jpg",
            summary: "요약",
            rating: 10.0,
          },
          {
            id: 11,
            title: "Movie without images 2",
            background_image: "",
            medium_cover_image: "",
            summary: "포스터/배경 없는 영화 2 - 빈 문자열인 경우",
            rating: 7.0,
          },
          {
            id: 12,
            title: "Movie title 3",
            background_image: "mock-images/bg3.jpg",
            medium_cover_image: "mock-images/poster3.jpg",
            summary: "요약",
            rating: 10.0,
          },
        ],
      },
    })
  ),
];
