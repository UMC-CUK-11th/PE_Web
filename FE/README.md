# UMCine 프론트엔드

이 문서는 FE 프로젝트를 처음 여는 개발자가 실행 방법과 파일의 역할을 찾기 위해 사용합니다. 영화 목록·검색·상세 화면을 React로 표시하고, 북마크 ID는 Zustand와 브라우저 `localStorage`로 관리합니다.

## 실행과 확인

VS Code에서 **FE 폴더**를 열고 통합 터미널에서 실행합니다.

```bash
pnpm install
pnpm dev
```

터미널에 표시된 로컬 주소를 브라우저에서 엽니다. 변경을 검사할 때는 같은 FE 폴더에서 다음 명령을 실행합니다.

```bash
pnpm build
pnpm lint
```

## 직접 관리하는 파일

| 파일 | 왜 있으며 무엇을 수정하는가 |
| --- | --- |
| `index.html` | 브라우저가 처음 받는 HTML 틀입니다. 문서 제목·아이콘·React가 붙을 `#root`를 바꿀 때 확인합니다. |
| `src/main.tsx` | React 앱의 시작점입니다. 라우터와 전역 CSS를 연결합니다. |
| `src/index.css` | Tailwind CSS를 앱 전체에 불러옵니다. |
| `src/types/movie.ts` | 영화 객체에 필요한 필드와 타입을 한곳에서 정합니다. |
| `src/data/movies.ts` | 현재 서버 API 대신 쓰는 학습용 영화 데이터를 담습니다. |
| `src/stores/bookmark-store.ts` | 화면들이 공유하는 북마크 ID와 추가·해제, 저장·복원을 담당합니다. |
| `src/utils/cn.ts` | 조건부 Tailwind 클래스를 합칠 때 재사용하는 함수입니다. |
| `src/routes/__root.tsx` | 모든 페이지가 공유하는 헤더와 배경, 하위 화면의 위치를 정합니다. |
| `src/routes/index.tsx` | `/` 주소를 영화 목록 페이지에 연결합니다. |
| `src/routes/search.tsx` | `/search` 주소와 `query` 검색어의 형태를 정합니다. |
| `src/routes/movies.$movieId.tsx` | 영화 ID가 포함된 주소를 상세 페이지에 연결합니다. |
| `src/pages/movies/movie-list-page.tsx` | 목록 화면과 페이지 번호, TMDB 출처 표시를 구성합니다. |
| `src/pages/movies/search-page.tsx` | URL 검색어로 영화를 찾고 결과를 표시합니다. |
| `src/pages/movies/movie-detail-page.tsx` | URL의 영화 ID로 상세 데이터를 찾고 표시합니다. |
| `src/components/layout/header.tsx` | 모든 페이지에서 재사용하는 메뉴입니다. |
| `src/components/movies/movie-grid.tsx` | 영화 배열을 카드 목록으로 배치합니다. |
| `src/components/movies/movie-card.tsx` | 영화 한 편의 포스터·제목·상세 링크를 표시합니다. |
| `src/components/movies/bookmark-button.tsx` | 목록·검색·상세에서 동일한 북마크 상태와 클릭 동작을 사용합니다. |
| `src/components/movies/pagination.tsx` | 현재 선택된 페이지 번호를 표시합니다. 이 실습에서는 영화 10편을 자르지 않습니다. |
| `vite.config.ts` | React·TanStack Router·Tailwind의 Vite 플러그인을 연결합니다. |
| `eslint.config.js` | `pnpm lint`가 검사할 대상과 규칙을 정합니다. |
| `tsconfig.json` | 앱 코드와 Vite 설정의 TypeScript 검사를 묶습니다. |
| `tsconfig.app.json` | 브라우저에서 실행되는 `src` 코드의 타입 검사 규칙입니다. |
| `tsconfig.node.json` | Node.js에서 실행되는 Vite 설정의 타입 검사 규칙입니다. |
| `.gitignore` | Git에 기록하지 않을 설치·빌드·개인 설정 파일을 정합니다. |
| `package.json` | 실행 명령과 직접 사용하는 패키지를 기록합니다. 표준 JSON은 주석을 허용하지 않아 이 표에서 역할을 설명합니다. |

## 이미지와 자동 생성 파일

`public/images/movies/`의 JPG는 영화 포스터와 상세 배경입니다. 어떤 영화가 어떤 파일을 쓰는지는 `src/data/movies.ts`에서 확인합니다. `public/images/logos/tmdb-logo.svg`의 출처와 사용 조건은 `public/SOURCES.md`에 적었습니다. 바이너리 이미지에는 코드 주석을 넣을 수 없습니다.

`public/icons/`는 화면에서 사용할 수 있는 SVG 아이콘 모음입니다. 현재 페이지 번호의 좌우 화살표는 `chevron-left.svg`와 `chevron-right.svg`를 사용합니다. `public/favicon.svg`는 브라우저 탭 아이콘이며, `public/icons.svg`는 별도 아이콘 묶음입니다. `src/assets/`의 Vite·React SVG와 `hero.png`는 초기 템플릿에서 남은 에셋으로 현재 화면에서 참조하지 않습니다.

`src/routeTree.gen.ts`, `.tanstack/`, `dist/`, `pnpm-lock.yaml`, `node_modules/`는 라우터 생성·빌드·패키지 설치 과정에서 만들어지거나 갱신됩니다. 직접 설명 주석을 작성할 대상으로 삼지 않습니다.
