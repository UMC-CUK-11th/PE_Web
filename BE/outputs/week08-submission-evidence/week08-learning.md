# 8주차 개념 정리·학습 후기 초안

## 클라이언트 상태와 서버 상태

폼 입력은 사용자가 화면에서 작성 중인 값이므로 React useState가 원본이다. 로그인 토큰은 이후 인증 요청에 사용하는 클라이언트 보관 값이므로 Zustand persist에서 관리한다. 회원 정보·즐겨찾기·평점의 원본은 서버 DB이므로 TanStack Query는 그 복사본을 조회·갱신하는 캐시 역할을 한다.

같은 회원 정보를 전역 store와 Query에 따로 저장하면 한쪽만 수정되어 화면마다 닉네임이 달라질 수 있다. 이번 구현은 토큰만 store에 저장하고 내 정보는 Query를 공통으로 사용한다.

## 캐시 일관성

서버 수정이 성공해도 다른 query key의 캐시가 자동으로 바뀌는 것은 아니다. staleTime이 남아 있거나 기존 캐시를 사용하면 이전 값이 보일 수 있으므로 관련 캐시를 갱신해야 한다.

invalidateQueries는 해당 캐시를 stale로 표시한다. 활성 Query는 다시 조회하고 비활성 Query는 이후 사용 시 조회될 수 있다. 목록처럼 변경 후 전체 결과를 다시 확인할 필요가 있을 때 적절하다. 이번 즐겨찾기 목록은 이 방식을 사용한다. [공식 문서](https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations)

setQueryData는 캐시 값을 직접 바꾼다. 이번 프로필 PATCH 응답에는 최신 회원 정보가 들어 있으므로 추가 GET 없이 같은 me 캐시를 바꿔 조회 화면과 헤더에 반영한다. 서버가 계산한 다른 값이 필요한데 응답에 없다면 다시 조회하는 편이 적절하다. [공식 문서](https://tanstack.com/query/latest/docs/framework/react/guides/updates-from-mutation-responses)

useMutation은 데이터 변경 요청의 idle/pending/success/error 상태와 data/error를 관리한다. 폼 입력값까지 대신 관리하지는 않는다. mutationOptions는 여러 곳에서 사용하는 변경 요청 설정을 분리할 때 사용한다.

## 한 줄 학습 후기 초안

useMutation으로 요청 상태를 관리하고, 변경 응답과 재조회를 상황에 맞게 사용해 여러 화면의 회원 정보·즐겨찾기·평점을 일관되게 갱신하는 방법을 배웠습니다.
