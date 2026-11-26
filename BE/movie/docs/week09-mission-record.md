# 9주차 백엔드 미션 기록

Spring Boot 영화 평점 서비스의 API 15개를 OpenAPI로 생성하고, Spring MVC와 H2로 실제 요청 처리와 저장 결과를 검증했다. 필수 평점 테스트와 선택 영화 기록 롤백 검증을 포함했다.

## 구현 과정

1. 기존 8주차 커밋에는 영화 기록 서비스와 테스트가 있지만 이들이 참조하는 즐겨찾기 소스가 빠져 있었다. 로컬 8주차 작업 기록 `a7b2e35e`에서 즐겨찾기 컨트롤러, 서비스, DTO, 엔티티, 저장소, 테스트와 SQL을 복원했다.
2. 기존 springdoc 2.8.13 설정에서 Swagger UI가 읽던 정적 8주차 문서 URL을 제거했다. 컨트롤러의 매핑과 DTO를 바탕으로 `/v3/api-docs`를 생성하고, 각 API의 설명과 오류 상태 코드, 공개 요청 예시를 추가했다.
3. `@LoginMember` 매개변수가 있는 API에 Bearer 인증을 표시했다. 인증이 필요한 API 10개에 자물쇠가 표시되며, 공개 API 5개에는 표시가 없다. Swagger의 JSON, YAML 및 UI 설정 경로는 GET 요청으로 공개했다.
4. Swagger UI의 회원가입과 로그인으로 H2 임시 회원의 JWT를 발급받았다. Authorize에 입력하고 즐겨찾기 등록을 두 번 호출한 뒤 로그아웃하고 같은 요청을 한 번 더 호출했다.
5. 중복 검사와 트랜잭션을 각각 제거해 대상 테스트를 실행했다. 실패를 확인한 뒤 소스를 복구하고 전체 테스트 62개가 통과하는 것을 확인했다.

## API 응답과 테스트

| 검증 | 기대 결과 |
| --- | --- |
| Swagger UI에서 즐겨찾기 최초 등록 | 201 `COMMON201`, 영화 ID 550 |
| Swagger UI에서 같은 영화를 다시 등록 | 409 `FAVORITE409_1` |
| Swagger UI에서 로그아웃한 뒤 등록 | 401 `AUTH401_2` |
| 즐겨찾기 서비스 단위 테스트 2개 | 최초 등록 시 저장 호출, 중복 시 409 `FAVORITE409_1`과 저장 생략 |
| 즐겨찾기 통합 테스트 4개 | 미인증 401, 정상 등록 201, 중복 409, 미등록 영화의 `isFavorite: false` |
| 평점 서비스 단위 테스트 2개 | 중복 등록 시 409 `RATING409_1`, 타인 평점 수정 시 403 `RATING403_1` |
| 평점 통합 테스트 2개 | 미인증 401 `AUTH401_2`와 미저장, 인증 후 201 `COMMON201`과 DB 저장 |
| 영화 기록 롤백 | 이미 즐겨찾기한 영화의 기록 요청이 409 `FAVORITE409_1`로 실패하고 평점 수가 그대로 유지됨 |

중복 검사를 제거하자 서비스 단위 테스트에서 호출하면 안 되는 `saveAndFlush`가 실행됐고, 통합 테스트에서는 DB 유니크 제약으로 인해 409 상태는 유지됐지만 응답 코드가 `FAVORITE409_1`에서 `COMMON4091`로 바뀌었다.

영화 기록 서비스에서 `@Transactional`을 제거하자 즐겨찾기 충돌 응답은 그대로였고, 평점이 0건이어야 하는 테스트에서 1건이 남았다. 평점 저장과 즐겨찾기 저장을 묶는 트랜잭션이 롤백을 보장함을 확인했다.

## 트러블슈팅

| 이슈 | 문제 | 해결 |
| --- | --- | --- |
| 영화 기록의 즐겨찾기 참조를 컴파일할 수 없었다 | 현재 브랜치에 즐겨찾기 파일이 누락돼 있었다 | 저장소의 8주차 작업 기록에서 필요한 경로만 복원했다 |
| 복원한 즐겨찾기 통합 테스트에서 `$.result.memberId`를 찾지 못했다 | 현재 `GET /members/me`의 프로필 DTO는 이메일, 닉네임, 가입일을 반환한다 | 상태 200과 실제 계약에 있는 이메일을 검증하도록 테스트를 맞췄다 |
| Swagger UI가 정적 문서를 읽고, 생성 JSON을 토큰 없이 열 수 없었다 | UI 설정이 8주차 JSON을 가리키고 인증 예외에는 Swagger 설정 경로만 포함돼 있었다 | 정적 문서 URL 설정을 제거하고 문서 JSON과 YAML 경로를 공개했다. 문서 설정의 `url`도 테스트로 검증했다 |

## 핵심 키워드와 회고

- **OpenAPI와 Swagger UI**. OpenAPI는 HTTP API를 기술하는 명세다. Swagger UI는 이 명세를 화면으로 렌더링하고 브라우저에서 API를 호출할 수 있게 한다. 매핑과 스키마를 자동 생성해도 서비스의 오류 코드와 구체적인 예시는 코드에 명시해야 한다. [OpenAPI 3.1 명세](https://spec.openapis.org/oas/v3.1.0), [Swagger UI](https://swagger.io/open-source/swagger-ui/)
- **단위 테스트와 통합 테스트**. Mockito 단위 테스트는 저장소를 대체해 서비스의 판단과 저장 요청 여부를 검증한다. Spring 컨텍스트와 H2를 사용하는 통합 테스트는 MockMvc 요청이 인증, 검증, 서비스, DB를 거쳐 응답으로 돌아오는 흐름을 확인한다. [Spring 단위 테스트](https://docs.spring.io/spring-framework/reference/testing/unit.html), [Spring MockMvc](https://docs.spring.io/spring-framework/reference/testing/mockmvc.html)
- **Mock과 Stub**. `given(...).willReturn(true)`로 중복 데이터가 있다는 응답을 설정하는 부분이 스터빙이다. `verify(..., never())`는 저장 요청을 보내지 않았는지 Mock의 호출 기록을 확인한다. [Mockito](https://site.mockito.org/), [Test Double](https://martinfowler.com/bliki/TestDouble.html)
- **Given When Then**. 중복 데이터를 준비하고(Given), 등록을 요청한 뒤(When), 예외 코드와 저장 여부를 확인한다(Then). [Given When Then](https://martinfowler.com/bliki/GivenWhenThen.html)
- **회귀 테스트**. 이미 합의한 API 동작을 테스트로 고정한다. 이번 실습에서는 HTTP 상태만 검사하면 `FAVORITE409_1`이 `COMMON4091`로 바뀐 문제를 놓칠 수 있었고, 응답만 검사하면 트랜잭션 제거 후 남은 평점을 놓칠 수 있었다.

## 재현과 증빙

- Windows에서 `movie` 디렉터리 기준 전체 테스트 실행 명령은 `.\gradlew.bat test --console=plain`이다. 통합 테스트는 `test` 프로필의 H2와 테스트 JWT 키를 사용한다.
- 서버 실행 후 `/swagger-ui.html`에서 UI를, `/v3/api-docs`에서 생성된 JSON을 열 수 있다. 브라우저 검증에는 별도의 로컬 H2 서버를 사용했다.
- [Swagger 전체 목록](../../outputs/week09-be-evidence/01-swagger-all.png), [즐겨찾기 등록 문서](../../outputs/week09-be-evidence/02-swagger-post-favorites.png)
- 즐겨찾기 실응답 [201 등록](../../outputs/week09-be-evidence/12-favorite-created-201.png), [409 중복](../../outputs/week09-be-evidence/13-favorite-duplicate-409.png), [401 미인증](../../outputs/week09-be-evidence/14-favorite-no-token-401.png). 캡처의 JWT는 가렸다.
- [전체 테스트 통과](../../outputs/week09-be-evidence/15-all-tests-pass.png), [롤백 테스트 통과](../../outputs/week09-be-evidence/20-transaction-rollback-pass.png)
- 실패 실험 [즐겨찾기 단위 테스트](../../outputs/week09-be-evidence/21-favorite-unit-mutation-fail.png), [즐겨찾기 통합 테스트](../../outputs/week09-be-evidence/22-favorite-api-mutation-fail.png), [트랜잭션 제거](../../outputs/week09-be-evidence/23-transaction-mutation-fail.png)
- [평점 서비스 단위 테스트](../src/test/java/com/umc/movie/service/RatingServiceTest.java)
- [평점 API 통합 테스트](../src/test/java/com/umc/movie/WriteApiIntegrationTests.java)
- [영화 기록 롤백 테스트](../src/test/java/com/umc/movie/MovieRecordIntegrationTests.java)
