import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateCurrentUser } from "../../services/apiAuthServices";

export function useUpdateUser() {
  const qureyClient = useQueryClient();

  const { mutate: updateUser, isPending: updating } = useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: ({ user }) => {
      toast.success("User Account Succefully updating");
      qureyClient.setQueryData(["user"], user);

      // qureyClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => toast.error(error.message),
  });

  return { updateUser, updating };
}
