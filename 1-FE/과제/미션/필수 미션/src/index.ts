// 1. ID·이름·역할·선택 값 GitHub 아이디를 타입으로 표현하고, 서로 다른 회원 두 명 이상 작성
interface StudyMember {
  id: number;
  name: string;
  role: "leader" | "member";
  githubId?: string;
}

const members: StudyMember[] = [
  { id: 1, name: "광수", role: "leader", githubId: "gwangsoo" },
  { id: 2, name: "지수", role: "member" },
];

// 2. ID로 안내 문구 생성. GitHub 아이디가 없거나 회원을 찾지 못한 경우도 처리
function createMemberMessage(id: number): string {
  const member = members.find((member) => member.id === id);
  if (!member) return `ID ${id} 회원을 찾을 수 없습니다.`;

  const role = member.role === "leader" ? "스터디장" : "스터디원";
  const githubId = member.githubId ?? "등록되지 않음";
  return `${member.name} (${role}) · GitHub: ${githubId}`;
}

// 3. ID 1·2·999의 결과 확인, 타입 검사·컴파일·실행
// 필수 미션 폴더에서: pnpm exec tsc --noEmit → pnpm exec tsc → node dist/index.js
for (const id of [1, 2, 999]) console.log(createMemberMessage(id));

export {};
