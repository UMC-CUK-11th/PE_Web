type Member = {
  ID: number;
  name: string;
  memberRole: string;
  gitHubID?: string;
};

const members: Member[] = [
  { ID: 1, name: '민지', memberRole: 'member', gitHubID: 'minji' },
  { ID: 2, name: '지수', memberRole: 'leader' },
];

function findMember(id: number): string {
  const member = members.find((member) => member.ID === id);

  if (!member) {
    return `ID가 ${id}인 회원을 찾을 수 없습니다.`;
  }

  if (!member.gitHubID) {
    return `${member.name}님은 ${member.memberRole}이며, GitHub 아이디가 없습니다.`;
  }

  return `${member.name}님은 ${member.memberRole}이며, GitHub 아이디는 ${member.gitHubID}입니다.`;
}

console.log(findMember(1));
console.log(findMember(2));
console.log(findMember(999));
