type MemberRole = "leader" | "member";

type StudyMember = {
  id: number;
  name: string;
  role: MemberRole;
  gitHubId?: string;
};

const members: StudyMember[] = [
  {
    id: 1,
    name: "광수",
    role: "leader",
    gitHubId: "gwangsu"
  },
  {
    id: 2,
    name: "민수",
    role: "member"
  }
];

function getMemberInfo(memberId: number) {
  const member = members.find((member) => member.id === memberId);

  if (!member) {
    return "존재하지 않는 회원입니다";
  }

  const gitHubId = member.gitHubId ?? "등록되지 않음";

  return (
    "안녕하세요 " +
    member.name +
    "님! 당신은 " +
    member.role +
    "입니다. GitHubId는 " +
    gitHubId +
    "입니다"
  );
}

console.log(getMemberInfo(1));
console.log(getMemberInfo(2));
console.log(getMemberInfo(999));