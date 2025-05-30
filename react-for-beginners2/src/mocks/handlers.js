// src/mocks/handlers.js
import { http, HttpResponse } from "msw";

export const handlers = [
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
];
