type MemberRole = "스터디장" | "스터디원";

type StudyMember = {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string;
};

const members: StudyMember[] = [
  {
    id: 1,
    name: "김동휘",
    role: "스터디장",
    githubId: "donghwi-kim",
  },
  {
    id: 2,
    name: "이서연",
    role: "스터디원",
  },
];

function createMemberGuide(memberId: number): string {
  const member = members.find(({ id }) => id === memberId);

  if (!member) {
    return `회원 ID ${memberId}: 등록된 회원을 찾을 수 없습니다.`;
  }

  const githubGuide = member.githubId
    ? `GitHub 아이디는 ${member.githubId}입니다.`
    : "등록된 GitHub 아이디가 없습니다.";

  return `회원 ID ${member.id}: ${member.name}님은 ${member.role}입니다. ${githubGuide}`;
}

const memberIdsToCheck = [1, 2, 999];

for (const memberId of memberIdsToCheck) {
  console.log(createMemberGuide(memberId));
}
