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
    name: "얄루",
    role: "leader",
    githubId: "yallu",
  },
  {
    id: 2,
    name: "뽀로로",
    role: "member",
  },
];

function getMemberInfo(id: number) {
  const member = members.find((member) => member.id === id);

  if (!member) {
    return "회원을 찾지 못했어요.";
  }

  let roleText = "";
  if (member.role === "leader") {
    roleText = "스터디를 이끌어요.";
  } else {
    roleText = "스터디에 참여해요.";
  }

  const githubText = member.githubId ?? "등록되지 않음";

  return member.name + " 님은 " + roleText + " GitHub: " + githubText;
}

console.log(getMemberInfo(1));
console.log(getMemberInfo(2));
console.log(getMemberInfo(999));