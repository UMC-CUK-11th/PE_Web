import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMeOptions } from "../api/mutation-options";
import { meKey } from "../api/private-query-options";
export function useUpdateMeMutation(onSettled: () => void) {
  const client = useQueryClient();
  return useMutation({ ...updateMeOptions(), onSuccess: (response) => {
    client.setQueryData(meKey, response.result);
  }, onSettled });
}
