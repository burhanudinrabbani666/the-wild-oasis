# Duplicating a Cabin

## Overview

Cabin duplication allows users to quickly create a copy of an existing cabin with a single click. This reuses the existing image to avoid unnecessary storage operations.

---

## Adding a Duplicate Button

### Creating the Duplicate Action

Add a duplicate button to the cabin row that creates a copy of the cabin.

```jsx
import { HiSquare2Stack } from "react-icons/hi2";
import { useCreateCabin } from "../hooks/useCreateCabin";

function CabinRow({ cabin }) {
  const { id, name, maxCapacity, regularPrice, discount, image, description } =
    cabin;

  // Use the same create mutation hook
  const { createCabin, isCreating } = useCreateCabin();

  function handleDuplicate() {
    createCabin({
      name: `Copy of ${name}`, // Add "Copy of" prefix to distinguish duplicates
      maxCapacity,
      regularPrice,
      discount,
      description,
      image, // Reuse the same image URL (no upload needed)
    });
  }

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

      <div>
        <button onClick={handleDuplicate} disabled={isCreating}>
          <HiSquare2Stack />
        </button>
        <button onClick={() => setShowForm((show) => !show)}>Edit</button>
        <button onClick={() => mutate(id)} disabled={isPending}>
          Delete
        </button>
      </div>
    </TableRow>
  );
}

export default CabinRow;
```

**How It Works:**

- `handleDuplicate()`: Calls the same `createCabin` mutation used for creating new cabins
- `name: "Copy of ${name}"`: Prefixes the name so users can identify duplicates
- `image`: Passes the existing image URL (string), not a file upload
- `isCreating`: Disables button during creation to prevent duplicate clicks

---

## Custom Hook for Reusability

### Extracting the Create Logic (Optional)

```jsx
// hooks/useCreateCabin.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createEditCabin } from "../services/apiCabins";

export function useCreateCabin() {
  const queryClient = useQueryClient();

  const { mutate: createCabin, isPending: isCreating } = useMutation({
    mutationFn: createEditCabin,
    onSuccess: () => {
      toast.success("Cabin successfully created");
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
    },
    onError: (error) => toast.error(error.message),
  });

  return { createCabin, isCreating };
}
```

**Benefits**: Reusability, DRY principle, cleaner components, easier testing.

---

## Smart Image Handling in API

### Detecting Existing Image URLs

The `createEditCabin` function handles both file uploads and existing URLs.

```jsx
export async function createEditCabin(newCabin, id) {
  // Check if image is already a URL (existing image)
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    "",
  );

  const imagePath = hasImagePath
    ? newCabin.image // Keep existing image URL
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // 1. CREATE or UPDATE
  let query = supabase.from("cabins");
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);
  if (id) query = query.update({ ...newCabin, image: imagePath }).eq("id", id);

  const { data, error } = await query.select();

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be created");
  }

  // 2. Skip upload if using existing image URL
  if (hasImagePath) return data;

  // 3. Upload new image
  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  // 4. Rollback on failure
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.error(storageError);
    throw new Error("Image could not be uploaded and cabin was not created");
  }

  return data;
}
```

**Key Points:**

- `hasImagePath`: Detects if image is a URL (true) or File (false)
- `if (hasImagePath) return data`: Skips upload for duplicates
- Same function handles create, edit, and duplicate

---

## Complete Duplication Flow

1. User clicks duplicate → `handleDuplicate()` runs
2. Cabin data extracted with "Copy of" name prefix
3. `createCabin()` called with existing image URL (string)
4. API detects URL (`hasImagePath = true`) → skips upload
5. New cabin record created with same image path
6. Success toast → cabin list refetches → duplicate appears

**Why It's Fast**: No file upload needed, just a database INSERT.

---

## Key Benefits

✓ **Instant Duplication**: No file upload = much faster than creating from scratch  
✓ **Storage Efficient**: Multiple cabins can share the same image  
✓ **Reuses Validation**: Existing cabin data is already valid  
✓ **Simple UX**: One click to duplicate  
✓ **Smart Detection**: Automatically detects and handles existing URLs

---

## Important Notes

⚠️ **Image Sharing**: Duplicates share the same image file in storage  
⚠️ **Name Prefix**: "Copy of" helps users identify duplicates  
⚠️ **No ID**: Duplicate creates a new cabin with a new auto-generated id  
⚠️ **Custom Hook**: Extract mutation logic to avoid code duplication  
⚠️ **Early Return**: `if (hasImagePath) return data` skips unnecessary upload

---

## Comparison: Create vs Duplicate

| Aspect          | Create New Cabin     | Duplicate Existing Cabin |
| --------------- | -------------------- | ------------------------ |
| **User Input**  | Fill entire form     | Single button click      |
| **Image**       | Upload new file      | Reuse existing URL       |
| **Upload Time** | Slow (file upload)   | Fast (no upload)         |
| **Storage**     | New file created     | Existing file reused     |
| **Validation**  | Full form validation | Pre-validated data       |

---

**Next Step:** [Abstracting React Query](./12-abstracting-react-query.md)
