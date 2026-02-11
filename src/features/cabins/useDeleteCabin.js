import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletingCabin as deletingCabinsApi } from "../../services/apiCabins";
import toast from "react-hot-toast";

export function useDeleteCabin() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deletingCabin } = useMutation({
    mutationFn: (id) => deletingCabinsApi(id),
    onSuccess: () => {
      // this make automaticlly refetch with validate
      toast.success("Cabin Successfully deleted");

      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },
    onError: (error) => toast.error(error.message), // guard
  });

  return { isDeleting, deletingCabin };
}
