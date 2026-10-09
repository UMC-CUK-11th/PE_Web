// 이 파일은 영화 객체의 공통 형태를 정의한다.
// 목록·검색·상세 화면이 같은 필드 이름과 타입을 사용하도록 한곳에 둔다.
export interface Movie {
  // URL의 movieId와 북마크 목록에서 같은 영화를 식별하는 값이다.
  id: number;
  title: string;
  originalTitle: string;
  releaseDate: string;
  posterPath: string;
  // 상세 화면의 넓은 배경에 사용할 이미지 경로다.
  backdropPath: string;
  genres: string[];
  runtime: string;
  tagline: string;
  overview: string;
}
