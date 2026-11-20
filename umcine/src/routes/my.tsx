import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/my')({
  component: MyPage,
});

function MyPage() {
  return (
    <div>
      <h1>마이페이지</h1>
    </div>
  );
}
