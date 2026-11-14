import { useRef, useState } from "react";
import type { CheckResponse } from "../api/members";
import { getRequestErrorMessage } from "../utils/auth/request-error";

interface CheckResult {
  value: string;
  available: boolean;
  message: string;
}

export function useDuplicateCheck(
  value: string,
  valid: boolean,
  label: string,
  request: (value: string) => Promise<CheckResponse>,
) {
  const [result, setResult] = useState<CheckResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const pending = useRef(false);
  const revision = useRef(0);
  const currentResult = result?.value === value ? result : null;

  function reset() {
    revision.current += 1;
    setResult(null);
  }

  async function check() {
    if (!valid || pending.current) return;
    pending.current = true;
    setIsChecking(true);
    setResult(null);
    const requestedRevision = revision.current;
    try {
      const response = await request(value);
      if (requestedRevision === revision.current) {
        setResult({
          value,
          available: response.available === true,
          message:
            response.available === true
              ? `사용 가능한 ${label}입니다.`
              : `이미 사용 중인 ${label}입니다.`,
        });
      }
    } catch (error) {
      if (requestedRevision === revision.current) {
        setResult({
          value,
          available: false,
          message: getRequestErrorMessage(
            error,
            "중복 확인에 실패했어요. 다시 시도해 주세요.",
          ),
        });
      }
    } finally {
      pending.current = false;
      setIsChecking(false);
    }
  }

  return {
    isChecking,
    isAvailable: currentResult?.available === true,
    message: currentResult?.message,
    check,
    reset,
  };
}
