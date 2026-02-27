import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuthServices";

export function useUser() {
  const { data: user, isPending: userLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });

  return { user, userLoading, isAuthenticated: !!user };
}
