package com.umc.movie.config;

// 여러 컨트롤러가 같은 실패 응답을 문서에 적어서 예시 JSON을 한곳에 모은다
public final class SwaggerExamples {

    private SwaggerExamples() {
    }

    public static final String UNAUTHORIZED_DESCRIPTION =
            "토큰 없음(AUTH401_2), 유효하지 않은 토큰(AUTH401_3), 만료된 토큰(AUTH401_4)";

    public static final String AUTH401_2 = """
            {
              "isSuccess": false,
              "code": "AUTH401_2",
              "message": "로그인이 필요한 요청입니다.",
              "result": null
            }
            """;

    public static final String AUTH401_1 = """
            {
              "isSuccess": false,
              "code": "AUTH401_1",
              "message": "이메일 또는 비밀번호가 올바르지 않습니다.",
              "result": null
            }
            """;

    public static final String COMMON4001_MOVIE_ID = """
            {
              "isSuccess": false,
              "code": "COMMON4001",
              "message": "영화 ID는 양수여야 합니다.",
              "result": null
            }
            """;

    public static final String COMMON4001_SCORE = """
            {
              "isSuccess": false,
              "code": "COMMON4001",
              "message": "별점은 5점 이하여야 합니다.",
              "result": null
            }
            """;

    public static final String COMMON4001_NICKNAME = """
            {
              "isSuccess": false,
              "code": "COMMON4001",
              "message": "닉네임은 2자 이상 12자 이하여야 합니다.",
              "result": null
            }
            """;

    public static final String COMMON4001_SIGN_UP = """
            {
              "isSuccess": false,
              "code": "COMMON4001",
              "message": "비밀번호는 대문자/소문자/숫자/특수문자를 포함한 8자 이상이어야 합니다.",
              "result": null
            }
            """;

    public static final String COMMON4092_SIGN_UP = """
            {
              "isSuccess": false,
              "code": "COMMON4092",
              "message": "이미 사용 중인 이메일입니다.",
              "result": null
            }
            """;

    public static final String MEMBER404_1 = """
            {
              "isSuccess": false,
              "code": "MEMBER404_1",
              "message": "해당 회원을 찾을 수 없습니다.",
              "result": null
            }
            """;

    public static final String MEMBER409_1 = """
            {
              "isSuccess": false,
              "code": "MEMBER409_1",
              "message": "이미 사용 중인 닉네임입니다.",
              "result": null
            }
            """;

    public static final String RATING403_1 = """
            {
              "isSuccess": false,
              "code": "RATING403_1",
              "message": "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.",
              "result": null
            }
            """;

    public static final String RATING404_1 = """
            {
              "isSuccess": false,
              "code": "RATING404_1",
              "message": "해당 평점을 찾을 수 없습니다.",
              "result": null
            }
            """;

    public static final String RATING409_1 = """
            {
              "isSuccess": false,
              "code": "RATING409_1",
              "message": "이미 이 영화에 평점을 남기셨습니다.",
              "result": null
            }
            """;

    public static final String FAVORITE404_1 = """
            {
              "isSuccess": false,
              "code": "FAVORITE404_1",
              "message": "즐겨찾기한 영화를 찾을 수 없습니다.",
              "result": null
            }
            """;

    public static final String FAVORITE409_1 = """
            {
              "isSuccess": false,
              "code": "FAVORITE409_1",
              "message": "이미 이 영화를 즐겨찾기하셨습니다.",
              "result": null
            }
            """;
}
