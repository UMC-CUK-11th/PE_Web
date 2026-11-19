# 8주차 핵심 키워드

- **트랜잭션**은 여러 DB 작업을 한 단위로 다룬다. 이 프로젝트는 영화 기록 서비스의 `@Transactional` 범위 안에 평점과 즐겨찾기 저장을 넣었다. 각 저장 서비스의 기본 전파 방식인 `REQUIRED`는 진행 중인 트랜잭션에 참여한다. [Spring Framework 트랜잭션 문서](https://docs.spring.io/spring/reference/6.2/data-access/transaction/declarative/annotations.html)
- **Commit과 rollback**은 변경을 확정하거나 취소하는 동작이다. 평점 INSERT가 실행된 뒤라도 즐겨찾기에서 런타임 예외가 나면 DB는 평점 INSERT를 취소한다.
- **원자성**은 트랜잭션의 작업들이 모두 성공하거나 모두 취소되는 성질이다. 사용자가 둘 다 요청했을 때 둘 중 하나만 보이는 상태를 막는다.
- **ACID**는 원자성(Atomicity), 일관성(Consistency), 격리성(Isolation), 지속성(Durability)을 뜻한다. 제약을 지키며 상태를 변경하고, 동시에 실행되는 트랜잭션의 가시성을 격리 수준으로 조절하며, 커밋된 변경은 DB가 보존한다.
- **UNIQUE 제약**은 같은 회원과 영화의 조합이 두 번 저장되는 것을 DB에서 막는다. 사전 조회는 사용자에게 구체적인 중복 오류를 주지만, 동시 요청이 조회를 함께 통과해도 데이터는 DB 제약이 지킨다.
- **낙관적 잠금**은 읽은 이후 다른 요청이 같은 행을 바꿨는지 저장 시점에 검사한다. JPA의 `@Version`이 대표적인 예이며, 이번 실습에서는 중복 행을 막기 위해 복합 UNIQUE를 사용했다. [Jakarta Persistence 명세](https://jakarta.ee/specifications/persistence/3.2/jakarta-persistence-spec-3.2.pdf)
