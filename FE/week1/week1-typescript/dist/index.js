"use strict";
const members = [
    { id: 1, name: "광수", role: "leader", githubId: "gwangsoo" },
    { id: 2, name: "지수", role: "member" },
];
function printMemberInfo(memberId) {
    const foundMember = members.find((member) => member.id === memberId);
    if (!foundMember) {
        console.log(`ID가 ${memberId}인 회원을 찾지 못했어요.`);
        return;
    }
    const displayGithubId = foundMember.githubId ?? "등록되지 않음";
    const roleMessage = foundMember.role === "leader" ? "스터디를 이끌어요." : "스터디에 참여해요.";
    console.log(`${foundMember.name} 님은 ${roleMessage} (GitHub: ${displayGithubId})`);
}
printMemberInfo(1);
printMemberInfo(2);
printMemberInfo(999);
