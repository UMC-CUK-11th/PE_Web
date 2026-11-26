import { Suspense } from "react";
import { notFound } from "next/navigation";

export default function Page({ params }: PageProps<"/[id]">) {
  return <Suspense fallback={<p role="status">할 일을 불러오는 중이에요.</p>}><Todo params={params} /></Suspense>;
}

async function Todo({ params }: Pick<PageProps<"/[id]">, "params">) {
  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id) || Number(id) > 200) notFound();
  const base = process.env.TODO_API_BASE_URL || "https://jsonplaceholder.typicode.com";
  const response = await fetch(base + "/todos/" + id, { cache: "no-store", signal: AbortSignal.timeout(5000) });
  if (response.status === 404) notFound();
  if (!response.ok) throw new Error("할 일을 불러오지 못했어요.");
  const todo: { title: string } = await response.json();
  return <><h1>Todo {id}</h1><p>{todo.title}</p></>;
}
