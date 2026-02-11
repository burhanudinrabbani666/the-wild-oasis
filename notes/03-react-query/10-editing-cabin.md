# Editing a Cabin

## Overview

This guide shows how to reuse the create form for editing existing cabins. We'll implement a toggle edit form, pre-populate fields with existing data, and handle both create and update operations in a single function.

---

## Adding Edit Functionality to Cabin Row

### Implementing a Toggle Edit Form

Add a button to show/hide the edit form and pass the cabin data for editing.

```jsx
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteCabin } from "../services/apiCabins";
import CreateCabinForm from "./CreateCabinForm";

function CabinRow({ cabin }) {
  // State to control edit form visibility
  const [showForm, setShowForm] = useState(false);

  const { id, name, maxCapacity, regularPrice, discount, image } = cabin;
  const queryClient = useQueryClient();

  // Delete mutation (from previous section)
  const { isPending, mutate } = useMutation({
    mutationFn: (id) => deleteCabin(id),
    onSuccess: () => {
      toast.success("Cabin successfully deleted");
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <>
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
        <div>
          {/* Toggle edit form visibility */}
          <button onClick={() => setShowForm((show) => !show)}>
            {showForm ? "Cancel" : "Edit"}
          </button>
          <button onClick={() => mutate(id)} disabled={isPending}>
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </TableRow>

      {/* Conditionally render edit form below the row */}
      {showForm && <CreateCabinForm cabinToEdit={cabin} />}
    </>
  );
}

export default CabinRow;
```

**How It Works:**

- `useState(false)`: Controls whether the edit form is visible
- `setShowForm((show) => !show)`: Toggles form visibility on button click
- `{showForm && <CreateCabinForm cabinToEdit={cabin} />}`: Shows form when `showForm` is true
- `cabinToEdit={cabin}`: Passes the entire cabin object to the form for editing

**Why This Pattern?**

- **Inline Editing**: Form appears directly below the cabin row
- **Single Form Component**: Reuses the same form for both create and edit
- **Simple Toggle**: One state variable controls the entire flow

---

## Updating the Form for Edit Mode

### Detecting Edit Mode and Pre-filling Data

Modify the form to handle both create and edit modes with default values.

```jsx
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createEditCabin } from "../services/apiCabins";

function CreateCabinForm({ cabinToEdit = {} }) {
  // Extract id separately from the rest of the cabin data
  const { id: editId, ...editValues } = cabinToEdit;

  // Determine if we're in edit mode (editId exists)
  const isEditSession = Boolean(editId);

  // Initialize form with default values if editing
  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditSession ? editValues : {}, // Pre-fill if editing
  });
  const { errors } = formState;

  const queryClient = useQueryClient();

  // Create mutation
  const { mutate: createCabin, isPending } = useMutation({
    mutationFn: (newCabin) => createEditCabin(newCabin),
    onSuccess: () => {
      toast.success("New cabin successfully created");
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
      reset();
    },
    onError: (error) => toast.error(error.message),
  });

  // Edit mutation
  const { mutate: editCabin, isPending: isEditing } = useMutation({
    mutationFn: ({ newCabinData, id }) => createEditCabin(newCabinData, id),
    onSuccess: () => {
      toast.success("Cabin successfully edited");
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
      reset();
    },
    onError: (error) => toast.error(error.message),
  });

  // Disable form while either mutation is in progress
  const isWorking = isPending || isEditing;

  function onSubmit(data) {
    // Handle image: keep existing URL (string) or use new upload (File)
    const image = typeof data.image === "string" ? data.image : data.image[0];

    if (isEditSession) {
      // Update existing cabin
      editCabin({ newCabinData: { ...data, image }, id: editId });
    } else {
      // Create new cabin
      createCabin({ ...data, image: image });
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Cabin name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("name", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isWorking}
          {...register("maxCapacity", {
            required: "This field is required",
            min: { value: 1, message: "Capacity should be at least 1" },
          })}
        />
      </FormRow>

      <FormRow label="Regular price" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          disabled={isWorking}
          {...register("regularPrice", {
            required: "This field is required",
            min: { value: 1, message: "Price should be at least 1" },
          })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          disabled={isWorking}
          defaultValue={0}
          {...register("discount", {
            required: "This field is required",
            validate: (value) =>
              value <= getValues().regularPrice ||
              "Discount should be less than regular price",
          })}
        />
      </FormRow>

      <FormRow label="Description" error={errors?.description?.message}>
        <Textarea
          id="description"
          disabled={isWorking}
          defaultValue=""
          {...register("description", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="Cabin photo" error={errors?.image?.message}>
        <FileInput
          id="image"
          accept="image/*"
          {...register("image", {
            // Image required only when creating (not editing)
            required: isEditSession ? false : "This field is required",
          })}
        />
      </FormRow>

      <FormRow>
        <Button variation="secondary" type="reset">
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isEditSession ? "Edit cabin" : "Create new cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
```

**Understanding the Form Logic:**

**1. Destructuring with Separation:**

```jsx
const { id: editId, ...editValues } = cabinToEdit;
```

- Extracts `id` and renames it to `editId`
- `editValues` contains all other cabin properties (name, price, etc.)
- This separation is needed because `id` shouldn't be in the form data

**2. Edit Mode Detection:**

```jsx
const isEditSession = Boolean(editId);
```

- `true` if editing an existing cabin (editId exists)
- `false` if creating a new cabin (editId is undefined)
- Used throughout the form to change behavior

**3. Default Values:**

```jsx
defaultValues: isEditSession ? editValues : {};
```

- If editing: pre-fill form with existing cabin data
- If creating: start with empty form
- React Hook Form automatically populates the inputs

**4. Image Handling:**

```jsx
const image = typeof data.image === "string" ? data.image : data.image[0];
```

- **String**: Existing image URL (when editing without changing image)
- **File**: New image upload (FileList[0])
- This allows users to edit cabins without re-uploading the same image

**5. Conditional Image Validation:**

```jsx
required: isEditSession ? false : "This field is required";
```

- Creating: Image is required
- Editing: Image is optional (keeps existing image if not changed)

**6. Two Separate Mutations:**

- `createCabin`: For new cabins (no id parameter)
- `editCabin`: For updates (requires id parameter)
- Both use the same `createEditCabin` function but with different arguments

---

## Unified Create/Edit API Function

### Handling Both Operations in One Function

This function intelligently handles both creating new cabins and updating existing ones.

```jsx
export async function createEditCabin(newCabin, id) {
  // Check if image is already uploaded (existing URL)
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  // Generate unique filename only if uploading new image
  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    "",
  );

  // Use existing URL or create new one
  const imagePath = hasImagePath
    ? newCabin.image // Keep existing URL
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // 1. Prepare the query
  let query = supabase.from("cabins");

  // 2a. CREATE: Insert new cabin if no id provided
  if (!id) {
    query = query.insert([{ ...newCabin, image: imagePath }]);
  }

  // 2b. UPDATE: Update existing cabin if id provided
  if (id) {
    query = query.update({ ...newCabin, image: imagePath }).eq("id", id);
  }

  // 3. Execute the query
  const { data, error } = await query.select();

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be created or updated");
  }

  // 4. Skip upload if using existing image
  if (hasImagePath) return data;

  // 5. Upload new image to storage
  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  // 6. Rollback on upload failure (delete cabin)
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.error(storageError);
    throw new Error("Image could not be uploaded and cabin was not saved");
  }

  return data;
}
```

**Step-by-Step Breakdown:**

**1. Image Path Detection:**

```jsx
const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);
```

- **True**: Image is a URL string (existing image, no upload needed)
- **False**: Image is a File object (new upload required)
- `?.` optional chaining prevents errors if image is undefined

**2. Conditional Image Path:**

```jsx
const imagePath = hasImagePath ? newCabin.image : `${supabaseUrl}/...`;
```

- Existing image: Use the current URL
- New image: Generate a new public URL

**3. Query Builder Pattern:**

```jsx
let query = supabase.from("cabins");
if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);
if (id) query = query.update({ ...newCabin, image: imagePath }).eq("id", id);
```

- Start with base query
- Add `.insert()` for create operations
- Add `.update().eq()` for edit operations
- This pattern keeps the code DRY (Don't Repeat Yourself)

**4. Conditional Upload:**

```jsx
if (hasImagePath) return data;
```

- If using existing image, skip upload and return immediately
- Only upload to storage when a new image is provided
- Prevents unnecessary storage operations

**5. Error Rollback:**

- If image upload fails after cabin creation/update, delete the cabin
- Maintains database consistency (no cabins without images)

---

## Complete Edit Flow

### From Click to Database Update

1. **User Clicks Edit**: Edit button toggles `showForm` to `true`
2. **Form Renders**: `CreateCabinForm` receives `cabinToEdit` prop
3. **Edit Detection**: `isEditSession` is `true` because `editId` exists
4. **Form Pre-fills**: `defaultValues` populates all fields with existing cabin data
5. **User Modifies Data**: User changes cabin name, price, or uploads new image
6. **User Submits**: Form validation runs
7. **Image Processing**:
   - No new image: `data.image` is a string (existing URL)
   - New image: `data.image[0]` is a File object
8. **Mutation Triggered**: `editCabin()` called with updated data and cabin id
9. **API Function Executes**:
   - Detects existing image URL (no upload needed)
   - Runs UPDATE query with `.eq("id", id)`
   - Returns updated cabin data
10. **Success Handler**:
    - Success toast appears
    - Cabin list query invalidated
    - React Query refetches cabin data
    - Form resets and closes
    - UI updates to show edited cabin

### Create Flow (for comparison)

1. User fills empty form
2. `isEditSession` is `false` (no `editId`)
3. Image is required
4. User submits → `createCabin()` called
5. API runs INSERT query (no id parameter)
6. New image uploaded to storage
7. New cabin appears in list

---

## Key Differences: Create vs Edit

| Aspect                | Create Mode         | Edit Mode                  |
| --------------------- | ------------------- | -------------------------- |
| **Form Fields**       | Empty               | Pre-filled with cabin data |
| **Image Required**    | Yes                 | No (optional)              |
| **Mutation Function** | `createCabin()`     | `editCabin()`              |
| **API Operation**     | INSERT              | UPDATE                     |
| **Image Upload**      | Always required     | Only if new image selected |
| **Button Text**       | "Create new cabin"  | "Edit cabin"               |
| **Form Visibility**   | Separate page/modal | Toggle below cabin row     |

---

## Key Benefits

✓ **Single Form Component**: Reuse the same form for create and edit  
✓ **Smart Image Handling**: Only uploads when necessary  
✓ **Pre-filled Data**: Users see current values when editing  
✓ **Inline Editing**: Edit form appears directly in the table  
✓ **Validation**: Same validation rules apply to both create and edit  
✓ **Type Safety**: TypeScript-friendly with proper type guards

---

## Important Notes

⚠️ **ID Separation**: Always destructure `id` separately from form values  
⚠️ **Image Type Check**: Use `typeof data.image === "string"` to detect existing vs new images  
⚠️ **Optional Chaining**: `?.startsWith?.()` prevents errors when image is undefined  
⚠️ **Query Builder**: Build query conditionally rather than duplicating code  
⚠️ **Skip Upload**: Return early if using existing image to avoid unnecessary storage operations  
⚠️ **Fixed Typos**: "vakue" → "value", "regulerPrice" → "regularPrice", "Succefully" → "successfully"

---

## Advanced: Why Separate Mutations?

You might wonder why we use two separate mutations instead of one:

```jsx
// Two mutations (our approach)
const { mutate: createCabin } = useMutation({ mutationFn: createEditCabin });
const { mutate: editCabin } = useMutation({
  mutationFn: ({ data, id }) => createEditCabin(data, id),
});

// Alternative: Single mutation
const { mutate } = useMutation({
  mutationFn: ({ data, id }) => createEditCabin(data, id),
});
```

**Benefits of Separate Mutations:**

1. **Different Success Messages**: "Created" vs "Edited"
2. **Different Callbacks**: Can reset form on create but not on edit
3. **Clearer Code**: Explicit intent when reading the code
4. **Better Loading States**: `isPending` for create, `isEditing` for edit
5. **Easier Debugging**: Can track which operation is running

---

## Troubleshooting Common Issues

**Problem**: Form doesn't pre-fill when editing  
**Solution**: Ensure `defaultValues` is set in `useForm()` and `cabinToEdit` is passed correctly

**Problem**: Image upload happens even when not changing image  
**Solution**: Check `hasImagePath` logic - should detect existing URLs

**Problem**: Edit button doesn't work  
**Solution**: Verify `showForm` state is toggling and `cabinToEdit` prop is passed

**Problem**: Both create and edit show the same button text  
**Solution**: Ensure `isEditSession` is correctly detecting edit mode

---

**Next Step:** [Abstracting React Query](./11-abstracting-react-query.md)
