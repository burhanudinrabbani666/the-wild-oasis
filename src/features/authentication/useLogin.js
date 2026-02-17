import { useMutation } from "@tanstack/react-query";
import { login as loginApi } from "../../services/apiAuthServices";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

export function useLogin() {
  const navigate = useNavigate();

  const { mutate: login, isPending: loginLoading } = useMutation({
    mutationFn: ({ email, password }) =>
      loginApi({
        email,
        password,
      }),
    onSuccess: () => {
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error("Provide email or password are incorrect");
    },
  });

  return { login, loginLoading };
}
