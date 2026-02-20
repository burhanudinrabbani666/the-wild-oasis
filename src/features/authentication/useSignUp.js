import { useMutation } from "@tanstack/react-query";
import { signup as signUpAPI } from "../../services/apiAuthServices";
import toast from "react-hot-toast";

export function useSignUp() {
  const { mutate: signUp, isPending: signUpLoading } = useMutation({
    mutationFn: signUpAPI,
    onSuccess: (user) => {
      console.log(user);
      toast.success(
        "Account Succesfully created! Please verify the new account form user's email address",
      );
    },
  });

  return { signUp, signUpLoading };
}
