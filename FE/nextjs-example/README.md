# Next.js 9주차 연습장

`npm ci` 후 `npm run dev`로 실행합니다. 빌드 결과를 보려면 `npm run build`, 프로덕션 실행은 `npm run start`를 사용합니다.

| 경로 | 실습 |
| --- | --- |
| `/` | Server Component와 이벤트를 가진 Client Component 조합 |
| `/new` | 정적 경로, title·description·Open Graph |
| `/1`, `/2` | 서버에서 공개 Todo API 조회, 공통 레이아웃과 Suspense |
| `/media` | 같은 원본을 `img`와 `next/image`로 비교하고 Geist 적용 |

`TODO_API_BASE_URL` 기본값은 `https://jsonplaceholder.typicode.com`입니다. 예제 앱 주소를 바꾸면 `APP_URL`로 Open Graph 이미지의 기준 주소를 설정할 수 있습니다.
