type StudyMember = {
    id: number;
    name: string;
    role: string;
    githubId?: string;
};

const members: StudyMember[] = [
  { id: 1 ,name: "광수", role: "leader" ,githubId: "gwangsoo" },
  { id: 2 , name: "지수", role: "member" },
];

function printInformation(id: number){
    const foundMember = members.find((member) => member.id === id);

    if (!foundMember) {
        console.log(`${id}번 회원을 찾을 수 없습니다.`);
        return;
    }

    if (foundMember.githubId) {
        console.log(`id: ${foundMember.id}, 이름: ${foundMember.name}, 역할 : ${foundMember.role}, githubId: ${foundMember.githubId}`);
    } else {
        console.log(`id: ${foundMember.id}, 이름: ${foundMember.name}, 역할 : ${foundMember.role}, GitHub 아이디는 등록하지 않았습니다.`);
    }

}

printInformation(1);
printInformation(2);
printInformation(999);