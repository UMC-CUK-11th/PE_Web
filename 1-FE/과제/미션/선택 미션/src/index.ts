// StudyMember와 같은 구조를 type으로 작성하고 공통점·차이점을 세 문장으로 정리
{
  interface StudyMember {
    id: number;
    name: string;
    role: "leader" | "member";
    githubId?: string;
  }

  type StudyMemberType = {
    id: number;
    name: string;
    role: "leader" | "member";
    githubId?: string;
  };

  // 1. 두 타입은 같은 회원 구조를 표현하므로 같은 객체를 사용할 수 있다.
  // 2. interface는 extends로 확장하고, 같은 이름의 호환되는 선언을 합칠 수 있다.
  // 3. type은 &로 조합하고 유니언·튜플·기본 타입도 표현하지만, 같은 이름의 선언을 합칠 수 없다.
  const memberWithType: StudyMemberType = { id: 3, name: "현우", role: "member" };
  const memberWithInterface: StudyMember = memberWithType;
  console.log(memberWithInterface);
}

// studyHour가 0일 때 ||와 ??의 결과·이유 비교
{
  const studyHour: number | undefined = 0;
  console.log(studyHour || 1); // 0을 거짓으로 취급하므로 1
  console.log(studyHour ?? 1); // null·undefined가 아니므로 0
}

// formatMemberId에서 unknown 입력을 숫자·문자열·그 밖의 값으로 구분
{
  function formatMemberId(input: unknown): string {
    if (typeof input === "number") return `MEMBER-${input}`;
    if (typeof input === "string") return input.toUpperCase();
    return "회원 ID를 확인할 수 없습니다.";
  }
  // 1 → MEMBER-1, "member-2" → MEMBER-2, null → 회원 ID를 확인할 수 없습니다.
  for (const input of [1, "member-2", null]) console.log(formatMemberId(input));
}

export {};
