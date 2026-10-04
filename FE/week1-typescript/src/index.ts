type StudyMember = {
    id: number;
    name: string;
    role: string;
    githubId?: string;
};

const member1: StudyMember = {
    id: 1,
    name: "one",
    role: "leader",
    githubId: "oneone",
};

const member2: StudyMember = {
    id: 2,
    name: "two",
    role: "student",
};

const members: StudyMember[] = [member1, member2];

function getId(userId: number) {
    const findMember = members.find((member) => member.id === userId);

    if (findMember) {
        console.log("======================");
        console.log("환영합니다. " + findMember.name);
        console.log("ID : " + findMember.id);
        console.log("role : " + findMember.role);
        console.log("깃허브 ID : " + (findMember.githubId ?? "깃허브 ID 없음"));
        console.log("======================");
    } else {
        console.log("회원을 찾지 못했어요");
    }
}

getId(1);
getId(2);
getId(999);