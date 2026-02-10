# Creating a Cabin with React Hook Form and React Query

## Prerequisites

### Configure Supabase Permissions

Before implementing create functionality, ensure proper database permissions are set.

**Steps:**

1. Navigate to your Supabase project dashboard
2. Go to **Authentication → Policies**
3. Select the `cabins` table
4. Add **INSERT** and **UPDATE** policies for authenticated users
5. Example policy: `INSERT` and `UPDATE` permissions for `authenticated` role

**Why This Matters:**  
Without proper Row Level Security (RLS) policies, create and update operations will fail even with correct code.

---

## Database Create Function

### Building the Insert Operation

This function adds a new cabin record to your Supabase database.

```js
export async function createCabin(newCabin) {
  // Insert the new cabin data into the cabins table
  const { data, error } = await supabase
    .from("cabins")
    .insert([newCabin]) // insert() expects an array of objects
    .select(); // Return the newly created record

  // Handle any errors during insertion
  if (error) {
    console.error(error);
    throw new Error("Cabin could not be created");
  }

  return data; // Returns the newly created cabin object
}
```

**How It Works:**

- `from("cabins")`: Targets the cabins table
- `insert([newCabin])`: Inserts a new record (must be an array, even for single insert)
- `.select()`: Returns the created record with all its fields (including auto-generated id)
- Error handling ensures failures are caught and communicated
- Throwing an error allows React Query to detect failed mutations

**Data Structure:**

```js
// newCabin object example:
{
  name: "Cabin 001",
  maxCapacity: 4,
  regularPrice: 300,
  discount: 50,
  description: "Cozy cabin in the woods",
  image: "cabin-001.jpg"
}
```

---

## Implementing in Components

### Combining React Hook Form with React Query

This integration handles form submission and database operations seamlessly.

```jsx
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createCabin } from "../services/apiCabins";

function CreateCabinForm() {
  // Form management with reset capability
  const { register, handleSubmit, reset } = useForm();

  // Access query client to invalidate cache
  const queryClient = useQueryClient();

  // Setup create mutation
  const { mutate, isPending } = useMutation({
    mutationFn: (newCabin) => createCabin(newCabin),

    onSuccess: () => {
      toast.success("New cabin successfully created");
      queryClient.invalidateQueries({ queryKey: ["cabins"] }); // Refetch list
      reset(); // Clear form fields
    },

    onError: (error) => toast.error(error.message),
  });

  // Form submission handler
  function onSubmit(data) {
    mutate(data); // Trigger the mutation with form data
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow>
        <Label htmlFor="name">Cabin name</Label>
        <Input
          type="text"
          id="name"
          {...register("name")}
          disabled={isPending}
        />
      </FormRow>

      <FormRow>
        <Label htmlFor="maxCapacity">Maximum capacity</Label>
        <Input
          type="number"
          id="maxCapacity"
          {...register("maxCapacity")}
          disabled={isPending}
        />
      </FormRow>

      <FormRow>
        <Button variation="secondary" type="reset">
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
```

**Understanding the Integration:**

**React Hook Form:**

- `register`: Connects input fields to the form
- `handleSubmit`: Validates and collects form data
- `reset()`: Clears all form fields after successful submission

**React Query:**

- `useMutation`: Handles the create operation
- `mutate(data)`: Triggers the mutation with form data
- `isPending`: Indicates if creation is in progress
- `queryClient.invalidateQueries()`: Refreshes the cabin list automatically

---

## Complete Creation Flow

1. **User Fills Form**: User enters cabin details in the form fields
2. **User Clicks Submit**: Submit button triggers `handleSubmit(onSubmit)`
3. **Form Validation**: React Hook Form validates the data (if rules are set)
4. **Mutation Triggered**: `mutate(data)` is called with the form data
5. **Database Insert**: `createCabin()` sends data to Supabase
6. **Success Path**:
   - New cabin is created in the database
   - `onSuccess` callback fires
   - Success toast notification appears
   - Cabin list query is invalidated
   - React Query refetches the cabin list
   - Form fields are reset to empty
   - UI updates to show the new cabin
7. **Error Path**:
   - Database operation fails
   - `onError` callback fires
   - Error toast shows the problem
   - Form remains filled for user to retry

---

## Key Benefits

✓ **Automatic UI Updates**: New cabin appears in the list without manual state management  
✓ **Form Reset**: Fields automatically clear after successful creation  
✓ **Loading States**: Submit button disabled during creation to prevent duplicates  
✓ **Error Handling**: User-friendly error messages via toast notifications  
✓ **Optimistic UX**: Foundation for instant UI updates before server confirms  
✓ **Type Safety**: Works seamlessly with TypeScript for compile-time checks

---

## Important Notes

⚠️ **Query Key Consistency**: Use the same `["cabins"]` key for both queries and invalidation  
⚠️ **Form Reset**: `reset()` only clears fields on success, preserving data on errors  
⚠️ **Disable Inputs**: Setting `disabled={isPending}` prevents edits during submission  
⚠️ **Insert Array**: Supabase `insert()` requires an array, even for single records  
⚠️ **Select After Insert**: `.select()` is needed to return the created record data

---

## Best Practices

**Disable During Submission:** `disabled={isPending}` on inputs and buttons  
**Visual Feedback:** `{isPending ? "Creating..." : "Create cabin"}`  
**Reset on Success Only:** `reset()` in `onSuccess` callback, not `onError`

---

**Next Step:** [Handling Form Errors](./08-handling-form-error.md)
