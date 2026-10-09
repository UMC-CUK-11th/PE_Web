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
    name: "효비",
    role: "member",
    githubId: "Hyobee02",
  },
  {
    id: 2,
    name: "민수",
    role: "leader",
  },
];

function getMemberGuide(id: number): string {
  const member = members.find((member) => member.id === id);

  if (!member) {
    return `회원 ID ${id}: 존재하지 않는 회원입니다.`;
  }

  const githubId = member.githubId ?? "GitHub 아이디 없음";

  return `회원 ID ${member.id}: ${member.name} / ${member.role} / GitHub: ${githubId}`;
}

[1, 2, 999].forEach((id) => {
  console.log(getMemberGuide(id));
});


type StudyMemberType = {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string;
};



const studyHour: number | undefined = 0;

console.log("studyHour || 1:", studyHour || 1); // 1
console.log("studyHour ?? 1:", studyHour ?? 1); // 0


function formatMemberId(input: unknown): string {
  if (typeof input === "number" && Number.isFinite(input)) {
    return `숫자 ID: ${input}`;
  }

  if (typeof input === "string" && input.trim() !== "") {
    return `문자열 ID: ${input.trim()}`;
  }

  return "지원하지 않는 ID 형식입니다.";
}

console.log(formatMemberId(1));
console.log(formatMemberId("2"));
console.log(formatMemberId(true));
