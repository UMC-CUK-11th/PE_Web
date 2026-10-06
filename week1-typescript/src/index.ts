type StudyMember = {
  name: string;
  githubId?: string;
};

const members: StudyMember[] = [
  { name: "체컵", githubId: "gwangsoo" },
  { name: "원준" },
];

let selectedMember: StudyMember | null = null;
const foundMember = members.find((member) => member.name === "고원준");

console.log(selectedMember); // null
console.log(foundMember); // undefined