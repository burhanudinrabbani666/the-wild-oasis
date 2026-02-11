# Uploading Images to Supabase Storage

## Overview

Supabase Storage provides secure file storage for your application. This guide shows how to upload cabin images alongside form data.

---

## Creating a File Input Component

### Styled File Input with Custom Button

```jsx
import styled from "styled-components";

// Create a styled file input with custom file selector button
const FileInput = styled.input.attrs({ type: "file" })`
  font-size: 1.4rem;
  border-radius: var(--border-radius-sm);

  /* Style the file picker button */
  &::file-selector-button {
    font: inherit;
    font-weight: 500;
    padding: 0.8rem 1.2rem;
    margin-right: 1.2rem;
    border-radius: var(--border-radius-sm);
    border: none;
    color: var(--color-brand-50);
    background-color: var(--color-brand-600);
    cursor: pointer;
    transition:
      color 0.2s,
      background-color 0.2s;

    &:hover {
      background-color: var(--color-brand-700);
    }
  }
`;

export default FileInput;
```

**How It Works:**

- `.attrs({ type: "file" })`: Automatically sets the input type to file
- `::file-selector-button`: Pseudo-element that styles the "Choose File" button
- Custom styling matches your app's design system
- Hover effect provides visual feedback

---

## Adding File Input to Form

### Integrating with React Hook Form

```jsx
<FormRow label="Cabin photo" error={errors?.image?.message}>
  <FileInput
    id="image"
    accept="image/*" // Only allow image files
    {...register("image", {
      required: "This field is required",
    })}
  />
</FormRow>
```

**Understanding the Props:**

- `accept="image/*"`: Restricts file picker to image files only
- `{...register("image")}`: Connects the file input to React Hook Form
- File data is stored as a `FileList` object

---

## Prerequisites: Supabase Storage Setup

**Create a Public Storage Bucket:**

1. Supabase Dashboard → **Storage** → **New Bucket**
2. Name: `cabin-images` (public bucket)
3. Add policies: **INSERT** for authenticated users, **SELECT** for public read
4. Public buckets allow direct image URLs in `<img>` tags

---

## Handling File Data

### Extracting the File from FileList

React Hook Form returns file inputs as a `FileList`, not a direct `File`.

```jsx
function CreateCabinForm() {
  const { register, handleSubmit, reset } = useForm();
  const { mutate } = useMutation({ mutationFn: createCabin });

  function onSubmit(data) {
    // data.image is FileList { 0: File, length: 1 }
    // Extract the first file: data.image[0]
    mutate({ ...data, image: data.image[0] });
  }

  return <Form onSubmit={handleSubmit(onSubmit)}>{/* ... */}</Form>;
}
```

**Key Point:** `data.image[0]` extracts the actual `File` object from the `FileList`.

---

## Updating the Create Function

### Implementing Image Upload with Error Handling

```jsx
export async function createCabin(newCabin) {
  // 1. Generate unique image name to prevent conflicts
  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    "",
  );

  // 2. Construct the public URL for the image
  const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // 3. Create cabin record with image URL
  const { data, error } = await supabase
    .from("cabins")
    .insert([{ ...newCabin, image: imagePath }])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be created");
  }

  // 4. Upload image to storage bucket
  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  // 5. If upload fails, delete the cabin record (rollback)
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.error(storageError);
    throw new Error("Image could not be uploaded and cabin was not created");
  }

  return data;
}
```

**How It Works:**

1. **Unique Filename**: `Math.random()` + filename prevents collisions, `.replaceAll("/", "")` prevents subdirectories
2. **Image URL**: Constructed path stored in database (not the file itself)
3. **Create Record**: Cabin saved with image URL
4. **Upload File**: Image uploaded to `cabin-images` bucket
5. **Rollback on Error**: If upload fails, cabin record is deleted to maintain consistency

---

## Complete Upload Flow

1. User selects image → fills form → submits
2. File extracted from `FileList`: `data.image[0]`
3. Unique filename generated with random prefix
4. Public image URL constructed for database
5. Cabin record created with image URL
6. Image file uploaded to storage bucket
7. **On failure**: Cabin record deleted (rollback)
8. **On success**: UI refreshes, new cabin with image appears

---

## Key Benefits

✓ **Atomic Operations**: Upload fails → cabin deleted (prevents orphaned data)  
✓ **Unique Filenames**: Random prefixes prevent filename collisions  
✓ **Public URLs**: Images directly accessible without authentication  
✓ **Error Recovery**: Automatic rollback on upload failure  
✓ **Validation**: File type restricted to images only

---

## Important Notes

⚠️ **Bucket Name**: Ensure bucket name matches in both setup and code (`cabin-images`)  
⚠️ **Public Access**: Set bucket to public for direct image URLs  
⚠️ **File Size**: Supabase has storage limits (check your plan)  
⚠️ **Filename Sanitization**: `.replaceAll("/", "")` prevents path traversal issues  
⚠️ **Rollback Logic**: Always delete cabin if image upload fails

---

**Next Step:** [Editing a Cabin](./10-editing-cabin.md)
