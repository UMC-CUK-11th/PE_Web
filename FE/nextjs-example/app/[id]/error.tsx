"use client";

export default function TodoError({ reset }: { reset: () => void }) {
  return <section role="alert"><p>할 일을 불러오지 못했어요.</p><button type="button" onClick={reset}>다시 시도</button></section>;
}
