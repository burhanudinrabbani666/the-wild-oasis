# Mutations: Deleting Cabins

## Prerequisites

### Configure Supabase Permissions

Before implementing delete functionality, ensure proper database permissions are set.

**Steps:**

1. Navigate to your Supabase project dashboard
2. Go to **Authentication → Policies**
3. Select the `cabins` table
4. Add a **DELETE** policy to allow authenticated users to delete cabins
5. Example policy: `DELETE` permission for `authenticated` role

**Why This Matters:**  
Without proper Row Level Security (RLS) policies, delete operations will fail even with correct code.

---

## Database Delete Function

### Creating the Delete Operation

This function handles the actual deletion of a cabin record from Supabase.

```js
export async function deleteCabin(id) {
  // Delete the cabin record where id matches
  const { data, error } = await supabase.from("cabins").delete().eq("id", id); // Filter: delete only the cabin with this specific id

  // Handle errors during deletion
  if (error) {
    console.error(error);
    throw new Error("Cabin could not be deleted");
  }

  return data; // Returns the deleted record data
}
```

**How It Works:**

- `from("cabins")`: Targets the cabins table
- `.delete()`: Specifies a delete operation
- `.eq("id", id)`: Filters to delete only the cabin matching the provided id
- Error handling ensures failures are caught and communicated
- Throws an error so React Query can detect the failed mutation

---

## Using Mutations in Components

### Implementing useMutation Hook

React Query's `useMutation` handles data modifications (create, update, delete) with automatic cache updates.

```jsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCabin } from "../services/apiCabins";

function CabinRow({ cabin }) {
  const { id, name, maxCapacity, regularPrice, discount, image } = cabin;

  // Access the query client to invalidate cache
  const queryClient = useQueryClient();

  // Setup delete mutation
  const { isPending, mutate } = useMutation({
    mutationFn: (id) => deleteCabin(id), // Function that performs the deletion

    onSuccess: () => {
      // Callback executed when deletion succeeds
      alert("Cabin successfully deleted");

      // Invalidate and refetch the cabins query to update the UI
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },

    onError: (error) => {
      // Callback executed when deletion fails
      alert(error.message);
    },
  });

  return (
    <TableRow role="row">
      <Img src={image} alt={name} />
      <Cabin>{name}</Cabin>
      <div>Fits up to {maxCapacity} guests</div>
      <Price>{formatCurrency(regularPrice)}</Price>
      {discount ? (
        <Discount>{formatCurrency(discount)}</Discount>
      ) : (
        <span>—</span>
      )}
      <button
        onClick={() => mutate(id)}
        disabled={isPending} // Disable button while deleting
      >
        {isPending ? "Deleting..." : "Delete"}
      </button>
    </TableRow>
  );
}

export default CabinRow;
```

**Understanding useMutation:**

- `mutationFn`: The async function that performs the delete operation
- `isPending`: Boolean indicating if mutation is in progress (prevents duplicate clicks)
- `mutate`: Function to trigger the mutation, accepts the cabin id as argument
- `onSuccess`: Runs after successful deletion - invalidates cache to trigger refetch
- `onError`: Runs if deletion fails - displays error message to user

**Query Invalidation Explained:**

- `queryClient.invalidateQueries()`: Marks the "cabins" query as stale
- React Query automatically refetches cabin data
- UI updates to reflect the deletion without manual state management

---

## Complete Mutation Flow

1. **User Clicks Delete**: The delete button triggers `mutate(id)`
2. **Mutation Executes**: `deleteCabin(id)` is called with the cabin's id
3. **Database Operation**: Supabase deletes the cabin record matching the id
4. **Success Handler**: If successful, `onSuccess` callback runs:
   - Shows success alert to user
   - Invalidates the `["cabins"]` query cache
   - React Query refetches cabin data automatically
5. **UI Updates**: Component re-renders with updated cabin list (deleted cabin removed)
6. **Error Handler**: If deletion fails, `onError` shows the error message

**During Mutation:**

- `isPending` is `true` → Delete button is disabled
- Button text changes to "Deleting..." for user feedback

**After Mutation:**

- `isPending` returns to `false` → Button re-enabled
- Cache invalidation ensures all components using cabin data see the update

---

## Key Benefits

✓ **Automatic Cache Updates**: No manual state management needed  
✓ **Optimistic UI Ready**: Foundation for instant UI feedback before server confirms  
✓ **Error Handling**: Built-in callbacks for success and failure scenarios  
✓ **Loading States**: `isPending` prevents duplicate operations  
✓ **Type Safety**: Mutations are strongly typed when using TypeScript  
✓ **Centralized Logic**: Database operations separated from UI components

---

## Important Notes

⚠️ **RLS Policies Required**: Delete operations will fail without proper Supabase policies  
⚠️ **Query Key Matching**: `invalidateQueries` must use the same key as your `useQuery` (`["cabins"]`)  
⚠️ **Fixed Typos**: Changed `deletingCabins` → `deleteCabin`, `regulerPrice` → `regularPrice`  
⚠️ **Better UX**: Consider replacing `alert()` with a proper toast notification system (covered in next section)  
⚠️ **Confirmation Dialog**: Consider adding "Are you sure?" confirmation before deletion

---

## Best Practices

**1. Import QueryClient Properly:**

```jsx
const queryClient = useQueryClient(); // Hook to access the client
```

**2. Disable Button During Mutation:**

```jsx
disabled = { isPending }; // Prevents multiple delete requests
```

**3. Provide User Feedback:**

```jsx
{
  isPending ? "Deleting..." : "Delete";
} // Clear visual feedback
```

---

**Next Step:** [Displaying Toast Notifications](./05-displaying-toast.md)
