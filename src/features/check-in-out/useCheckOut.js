import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useCheckOut() {
  const queryClient = useQueryClient();

  const { mutate: checkout, isPending: isCheckingOut } = useMutation({
    mutationFn: (bookingId) =>
      updateBooking(bookingId, {
        status: "checked-out",
      }),
    onSuccess: (data) => {
      toast.success(`Booking #${data.id} Succefully check-out`);
      queryClient.invalidateQueries({ active: true });
    },
    onError: (error) => {
      console.log(error);
      toast.error(`Error while checking in `);
    },
  });

  return { checkout, isCheckingOut };
}
