# Deleting a Booking

## Overview

Deleting a booking permanently removes it from the database. A confirmation modal prevents accidental deletions. The same delete logic is reused across both the bookings table row and the booking detail page.

---

## API Delete Function

```js
// apiBookings.js
export async function deleteBooking(id) {
  const { data, error } = await supabase.from("bookings").delete().eq("id", id); // Target specific booking

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }

  return data;
}
```

⚠️ **Requires RLS DELETE policy** on the `bookings` table in Supabase.

---

## Custom Hook for Deletion

```js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteBooking as deleteBookingApi } from "../services/apiBookings";

export function useDeleteBooking() {
  const queryClient = useQueryClient();

  const { isPending: isDeletingBooking, mutate: deleteBooking } = useMutation({
    mutationFn: deleteBookingApi,

    onSuccess: () => {
      toast.success("Booking successfully deleted");
      queryClient.invalidateQueries({ queryKey: ["bookings"] }); // Refresh booking list
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { isDeletingBooking, deleteBooking };
}
```

**How It Works:**

- `mutationFn: deleteBookingApi`: Calls delete API with booking ID
- `invalidateQueries(["bookings"])`: Triggers bookings list to refetch
- Returns `isDeletingBooking` for disabling UI during mutation

---

## Implementation in Booking Row

```jsx
function BookingRow({ booking }) {
  const { id: bookingId } = booking;
  const { isDeletingBooking, deleteBooking } = useDeleteBooking();

  return (
    <Table.Row>
      {/* ... booking data ... */}

      {/* Modal wraps entire Menu to share context */}
      <Modal>
        <Menus.Menu>
          <Menus.Toggle id={bookingId} />
          <Menus.List id={bookingId}>
            {/* Other buttons: See Details, Check out */}

            {/* Wrap delete button in Modal.Open */}
            <Modal.Open opens="delete">
              <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
            </Modal.Open>
          </Menus.List>

          {/* Modal window is sibling to Menu, inside Modal parent */}
          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName={`Booking #${bookingId}`}
              disabled={isDeletingBooking}
              onConfirm={() => deleteBooking(bookingId)}
            />
          </Modal.Window>
        </Menus.Menu>
      </Modal>
    </Table.Row>
  );
}
```

---

## Implementation in Booking Detail Page

### Delete with Navigate Back

```jsx
function BookingDetail() {
  const { booking } = useBooking();
  const navigate = useNavigate();
  const { isDeletingBooking, deleteBooking } = useDeleteBooking();
  const {
    id,
    guests: { fullName },
  } = booking;

  return (
    <>
      {/* ... booking details ... */}

      <ButtonGroup>
        <Modal>
          <Modal.Open opens="delete">
            <Button variation="danger">Delete</Button>
          </Modal.Open>

          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName={`${fullName}'s Booking`}
              disabled={isDeletingBooking}
              // Navigate back after deletion
              onConfirm={() =>
                deleteBooking(id, { onSettled: () => navigate(-1) })
              }
            />
          </Modal.Window>
        </Modal>

        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}
```

**Key Difference from Row:** After deleting from detail page, `onSettled: () => navigate(-1)` navigates back to bookings list. Without this, the user stays on a page for a deleted booking.

---

## ConfirmDelete Component

```jsx
function ConfirmDelete({ resourceName, onConfirm, disabled, onCloseModal }) {
  return (
    <div>
      <h3>Delete {resourceName}?</h3>
      <p>This action cannot be undone.</p>
      <Button variation="secondary" disabled={disabled} onClick={onCloseModal}>
        Cancel
      </Button>
      <Button variation="danger" disabled={disabled} onClick={onConfirm}>
        Delete
      </Button>
    </div>
  );
}
```

`onCloseModal` is automatically injected by `Modal.Window` via `cloneElement`.

---

## Complete Deletion Flow

1. Click "Delete" → modal opens with booking name
2. Confirm → `deleteBooking(bookingId)` called
3. Buttons disabled while `isDeletingBooking = true`
4. Database row removed
5. Toast shown → bookings cache invalidated → list refetches
6. **Detail page only**: `onSettled` navigates back to list

---

## Key Benefits

✓ **Confirmation Modal**: Prevents accidental deletions  
✓ **Reusable Hook**: Same logic in row and detail page  
✓ **Disabled State**: Prevents double-deletion during mutation  
✓ **Auto Navigation**: Detail page navigates back after delete  
✓ **Cache Refresh**: Bookings list updates automatically

---

## Important Notes

⚠️ **RLS Policy**: Must enable DELETE policy in Supabase for bookings table  
⚠️ **Modal Placement**: `<Modal>` must wrap both `Menus.Menu` and `Modal.Window`  
⚠️ **onSettled vs onSuccess**: Use `onSettled` for navigation — fires even on error  
⚠️ **resourceName**: Use descriptive name ("Booking #123") in confirmation text

---

**Next Step:** [Authentication — User Login with Supabase](./15-authentication-user.md)
