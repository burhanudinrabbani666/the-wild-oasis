import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateSetting as updateSettingAPI } from "../../services/apiSettings";

export function useUpdateSetting() {
  const qureyClient = useQueryClient();

  const { mutate: updateSetting, isPending: isUpdating } = useMutation({
    mutationFn: updateSettingAPI,
    onSuccess: () => {
      toast.success("Setting Succefully Edited");
      qureyClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (error) => toast.error(error.message),
  });

  return { updateSetting, isUpdating };
}
