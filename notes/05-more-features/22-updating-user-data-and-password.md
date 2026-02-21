# Updating User Data and Password

## Overview

Users can update their profile information (full name, avatar) and password. The API handles both password updates and avatar image uploads to Supabase Storage.

---

## API Update Function

```js
// apiAuth.js
export async function updateCurrentUser({ password, fullName, avatar }) {
  // 1. Update password OR fullName
  let updateData;
  if (password) updateData = { password };
  if (fullName) updateData = { data: { fullName } };

  const { data, error } = await supabase.auth.updateUser(updateData);
  if (error) throw new Error(error.message);
  if (!avatar) return data;

  // 2. Upload avatar image
  const fileName = `avatar-${data.user.id}-${Math.random()}`;
  const { error: storageError } = await supabase.storage
    .from("avatars")
    .upload(fileName, avatar);

  if (storageError) throw new Error(storageError.message);

  // 3. Update avatar URL in user metadata
  const { data: updatedUser, error: error2 } = await supabase.auth.updateUser({
    data: {
      avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
    },
  });

  if (error2) throw new Error(error2.message);
  return updatedUser;
}
```

**How It Works:**

- Updates password OR fullName (not both simultaneously)
- If avatar provided: uploads to Supabase Storage → updates user metadata with URL
- Returns early if no avatar to skip upload steps

---

## Custom useUpdateUser Hook

```js
// useUpdateUser.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateCurrentUser } from "../../services/apiAuth";

export function useUpdateUser() {
  const queryClient = useQueryClient();

  const { mutate: updateUser, isPending: isUpdating } = useMutation({
    mutationFn: updateCurrentUser,

    onSuccess: () => {
      toast.success("User account successfully updated");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },

    onError: (error) => toast.error(error.message),
  });

  return { updateUser, isUpdating };
}
```

**Why invalidate instead of setQueryData?**

- Avatar URL changes after upload
- Invalidating refetches complete updated user data
- Ensures UI shows correct avatar URL

---

## Update Profile Form

```jsx
function UpdateUserDataForm() {
  const {
    user: {
      email,
      user_metadata: { fullName: currentFullName },
    },
  } = useUser();
  const { updateUser, isUpdating } = useUpdateUser();
  const [fullName, setFullName] = useState(currentFullName);
  const [avatar, setAvatar] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!fullName) return;
    updateUser(
      { fullName, avatar },
      {
        onSuccess: () => {
          setAvatar(null);
          e.target.reset();
        },
      },
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="Email">
        <Input value={email} disabled />
      </FormRow>
      <FormRow label="Full name">
        <Input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={isUpdating}
        />
      </FormRow>
      <FormRow label="Avatar">
        <FileInput
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files[0])}
          disabled={isUpdating}
        />
      </FormRow>
      <FormRow>
        <Button type="reset" variation="secondary" disabled={isUpdating}>
          Cancel
        </Button>
        <Button disabled={isUpdating}>Update account</Button>
      </FormRow>
    </Form>
  );
}
```

Updates name and/or avatar. `e.target.reset()` clears file input after upload.

---

## Update Password Form

```jsx
function UpdatePasswordForm() {
  const { register, handleSubmit, formState, getValues, reset } = useForm();
  const { errors } = formState;
  const { updateUser, isUpdating } = useUpdateUser();

  function onSubmit({ password }) {
    updateUser({ password }, { onSuccess: reset });
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow
        label="New password (min 8 chars)"
        error={errors?.password?.message}
      >
        <Input
          type="password"
          disabled={isUpdating}
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 8,
              message: "Password needs minimum 8 characters",
            },
          })}
        />
      </FormRow>
      <FormRow
        label="Confirm password"
        error={errors?.passwordConfirm?.message}
      >
        <Input
          type="password"
          disabled={isUpdating}
          {...register("passwordConfirm", {
            required: "This field is required",
            validate: (value) =>
              getValues().password === value || "Passwords need to match",
          })}
        />
      </FormRow>
      <FormRow>
        <Button onClick={reset} type="reset" variation="secondary">
          Cancel
        </Button>
        <Button disabled={isUpdating}>Update password</Button>
      </FormRow>
    </Form>
  );
}
```

Separate form for security. Validates password length and confirmation match.

---

## Complete Update Flow

**Profile:** Submit → update name in metadata → upload avatar → get URL → update metadata → invalidate cache  
**Password:** Submit → validate → update password (hashed) → form resets

---

## Key Benefits

✓ **Separate Forms**: Profile and password updates isolated  
✓ **Avatar Upload**: Integrated with Supabase Storage  
✓ **Validation**: Password confirmation and length checks  
✓ **Optimistic UI**: Disabled states during updates  
✓ **Email Immutable**: Email field disabled (can't be changed)

---

## Important Notes

⚠️ **Storage Bucket**: Must create "avatars" bucket in Supabase Storage with public access  
⚠️ **Fixed Typos**: "qureyClient" → "queryClient", "Succefully" → "successfully", "reguler" → "regular"  
⚠️ **Avatar URL**: Full URL stored in metadata for easy access  
⚠️ **Unique Filenames**: `Math.random()` prevents conflicts (use UUID in production)  
⚠️ **No Simultaneous Updates**: Either password OR fullName, not both

---

**Next Step:** [Implement Dark Mode](./23-implement-dark-mode.md)
