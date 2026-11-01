import { useEffect, useState } from "react";

type RequestState<T> =
  | { status: "idle"; data: null; error: null }
  | { status: "loading"; data: null; error: null }
  | { status: "success"; data: T; error: null }
  | { status: "error"; data: null; error: unknown };

export function useRequest<T>(request: (signal: AbortSignal) => Promise<T>, enabled = true) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<RequestState<T>>({ status: "idle", data: null, error: null });

  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();
    let isActive = true;

    queueMicrotask(() => {
      if (isActive) setState({ status: "loading", data: null, error: null });
    });

    request(controller.signal)
      .then((data) => {
        if (isActive) setState({ status: "success", data, error: null });
      })
      .catch((error: unknown) => {
        if (!isActive || (error instanceof DOMException && error.name === "AbortError")) return;
        setState({ status: "error", data: null, error });
      });

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [attempt, enabled, request]);

  return {
    ...state,
    retry: () => setAttempt((currentAttempt) => currentAttempt + 1),
  };
}
