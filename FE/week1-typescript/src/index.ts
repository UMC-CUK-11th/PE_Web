// type MemberRole = "leader" | "member";

// interface StudyMember {
//   id: number;
//   name: string;
//   role: MemberRole;
//   githubId?: string;
// }

// const members: StudyMember[] = [
//   {
//     id: 1,
//     name: "김재범",
//     role: "leader",
//     githubId: "kinjaebeom",
//   },
//   {
//     id: 2,
//     name: "홍길동",
//     role: "member",
//   },
// ];

// function getMemberInfo(memberId: number) {
//   const member = members.find((member) => member.id === memberId);

//   if (!member) {
//     return `회원 ID ${memberId}에 해당하는 회원을 찾을 수 없습니다.`;
//   }

//   const githubId = member.githubId ?? "등록되지 않음";

//   return [
//     `회원 ID: ${member.id}`,
//     `이름: ${member.name}`,
//     `역할: ${member.role}`,
//     `GitHub ID: ${githubId}`,
//   ].join("\n");
// }

// console.log("[회원 ID 1]");
// console.log(getMemberInfo(1));

// console.log("\n[회원 ID 2]");
// console.log(getMemberInfo(2));

// console.log("\n[회원 ID 999]");
// console.log(getMemberInfo(999));




// 선택 미션

type MemberRole = "leader" | "member";

interface StudyMember {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string;
}

const members: StudyMember[] = [
  {
    id: 1,
    name: "김재범",
    role: "leader",
    githubId: "kinjaebeom",
  },
  {
    id: 2,
    name: "홍길동",
    role: "member",
  },
];

function getMemberInfo(memberId: number) {
  const member = members.find((member) => member.id === memberId);

  if (!member) {
    return `회원 ID ${memberId}에 해당하는 회원을 찾을 수 없습니다.`;
  }

  const githubId = member.githubId ?? "등록되지 않음";

  return [
    `회원 ID: ${member.id}`,
    `이름: ${member.name}`,
    `역할: ${member.role}`,
    `GitHub ID: ${githubId}`,
  ].join("\n");
}

console.log("[회원 ID 1]");
console.log(getMemberInfo(1));

console.log("\n[회원 ID 2]");
console.log(getMemberInfo(2));

console.log("\n[회원 ID 999]");
console.log(getMemberInfo(999));


// StudyMember와 같은 모양을 type으로 작성


type StudyMemberType = {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string;
};

const typeMember: StudyMemberType = {
  id: 3,
  name: "김철수",
  role: "member",
  githubId: "chulsoo",
};

console.log("\n[선택 미션 1 - type으로 작성한 회원]");
console.log(typeMember);


// || 와 ?? 비교


const studyHour: number | undefined = 0;

console.log("\n[선택 미션 2 - || 와 ?? 비교]");
console.log("studyHour || 1 =", studyHour || 1);
console.log("studyHour ?? 1 =", studyHour ?? 1);


//타입 안전하게 처리

function formatMemberId(input: unknown) {
  if (typeof input === "number") {
    return `MEMBER-${input}`;
  }

  if (typeof input === "string") {
    return input.toUpperCase();
  }

  return "회원 ID는 숫자 또는 문자열이어야 합니다.";
}

console.log("\n[선택 미션 3 - unknown 타입 처리]");
console.log(formatMemberId(10));
console.log(formatMemberId("member-20"));
console.log(formatMemberId(true));