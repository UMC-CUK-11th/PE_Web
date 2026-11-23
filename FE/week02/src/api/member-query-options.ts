import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { getMyInfo, updateMyInfo } from "./member-api";

export const memberQueryKeys = {
  all: ["member"] as const,
  me: () => [...memberQueryKeys.all, "me"] as const,
};

export function myInfoQueryOptions() {
  return queryOptions({
    queryKey: memberQueryKeys.me(),
    queryFn: getMyInfo,
  });
}

export function updateMyInfoMutationOptions() {
  return mutationOptions({
    mutationKey: [...memberQueryKeys.me(), "update"],
    mutationFn: updateMyInfo,
  });
}
