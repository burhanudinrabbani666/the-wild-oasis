# Checking Out a Booking

## Overview

Checking out a booking updates the booking status from `checked-in` to `checked-out` in the database. The button is only visible for bookings that are currently checked in.

---

## API Update Function

```js
export async function updateBooking(id, obj) {
  const { data, error } = await supabase
    .from("bookings")
    .update(obj) // Update with provided fields
    .eq("id", id) // Target specific booking
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }

  return data;
}
```

**How It Works:**

- `update(obj)`: Partial update — only provided fields change
- `.eq("id", id)`: Targets specific booking row
- Returns updated booking data for use in callbacks

---

## Custom Hook for Checkout

### useMutation for Status Update

```js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateBooking } from "../services/apiBookings";

export function useCheckOut() {
  const queryClient = useQueryClient();

  const { mutate: checkout, isPending: isCheckingOut } = useMutation({
    mutationFn: (bookingId) =>
      updateBooking(bookingId, {
        status: "checked-out", // Only change the status field
      }),

    onSuccess: (data) => {
      toast.success(`Booking #${data.id} successfully checked out`);
      // Invalidate all active queries to refresh UI
      queryClient.invalidateQueries({ active: true });
    },

    onError: (err) => {
      toast.error("Error while checking out");
    },
  });

  return { checkout, isCheckingOut };
}
```

**Understanding the Hook:**

- `mutationFn`: Calls `updateBooking` with `status: "checked-out"`
- `data` in onSuccess: The updated booking returned from API
- `invalidateQueries({ active: true })`: Refreshes all currently active queries
- Returns `checkout` function and `isCheckingOut` loading state

**Why invalidate all active queries?**

- Checking out affects multiple views (bookings list, dashboard, statistics)
- Refreshes wherever booking data is displayed
- Ensures consistent state across the app

---

## Implementing the Checkout Button

### Conditional Rendering in Booking Row

Only show the checkout button for `checked-in` bookings.

```jsx
import { HiArrowUpOnSquare } from "react-icons/hi2";
import { useCheckOut } from "../hooks/useCheckOut";

function BookingRow({ booking }) {
  const { id: bookingId, status } = booking;
  const { checkout, isCheckingOut } = useCheckOut();

  return (
    <Table.Row>
      {/* ... booking data ... */}

      <Menus.Menu>
        <Menus.Toggle id={bookingId} />
        <Menus.List id={bookingId}>
          <Menus.Button
            icon={<HiEye />}
            onClick={() => navigate(`/bookings/${bookingId}`)}
          >
            See Details
          </Menus.Button>

          {/* Only show for checked-in bookings */}
          {status === "checked-in" && (
            <Menus.Button
              icon={<HiArrowUpOnSquare />}
              onClick={() => checkout(bookingId)}
              disabled={isCheckingOut}
            >
              Check out
            </Menus.Button>
          )}
        </Menus.List>
      </Menus.Menu>
    </Table.Row>
  );
}
```

**How It Works:**

- `status === "checked-in"`: Conditionally renders checkout button
- `onClick={() => checkout(bookingId)}`: Triggers mutation
- `disabled={isCheckingOut}`: Prevents duplicate requests

---

## Status Flow

```
unconfirmed → checked-in → checked-out
```

| Status        | Available Actions |
| ------------- | ----------------- |
| `unconfirmed` | Check In          |
| `checked-in`  | Check Out         |
| `checked-out` | No actions        |

---

## Complete Checkout Flow

1. User opens booking row menu
2. "Check out" button visible only if `status === "checked-in"`
3. User clicks button → `checkout(bookingId)` called
4. `isCheckingOut = true` → button disabled
5. `updateBooking(bookingId, { status: "checked-out" })` runs
6. Database updates booking status
7. `onSuccess` callback fires:
   - Toast: "Booking #123 successfully checked out"
   - All active queries invalidated
   - Booking list refetches
8. Status changes from `checked-in` to `checked-out`
9. Checkout button disappears from menu

---

## Key Benefits

✓ **Conditional UI**: Button only visible for eligible bookings  
✓ **Partial Update**: Only status field changes, other data preserved  
✓ **Broad Invalidation**: All active queries refresh automatically  
✓ **Disabled State**: Prevents double-checkout during mutation  
✓ **User Feedback**: Toast confirms successful checkout

---

## Important Notes

⚠️ **Status Check**: Always conditionally render based on current status  
⚠️ **`active: true`**: Invalidates all active queries, not just bookings  
⚠️ **Fixed Typos**: "Succefully" → "successfully", removed incomplete error message  
⚠️ **Partial Update**: Pass only fields to change in `updateBooking` obj param

---

## Also Used in Booking Detail Page

```jsx
// Same hook, reused in detail page
{
  status === "checked-in" && (
    <Button onClick={() => checkout(id)} disabled={isCheckingOut}>
      Check out
    </Button>
  );
}
```

Same hook, same logic — reusable across different components.

**Next Step:** [Deleting a Booking](./14-deleting-a-booking.md)
