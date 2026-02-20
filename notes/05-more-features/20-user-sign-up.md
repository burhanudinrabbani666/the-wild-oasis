# User Sign Up

## Overview

Sign up creates new user accounts with React Hook Form for validation. Users provide full name, email, and password with confirmation. Form validates all fields before submission.

---

## Sign Up Form Component

```jsx
import { useForm } from "react-hook-form";
import { useSignup } from "./useSignup";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";

function SignupForm() {
  const { signup, isSigningUp } = useSignup();
  const { register, formState, getValues, handleSubmit, reset } = useForm();
  const { errors } = formState;

  function onSubmit({ fullName, email, password }) {
    signup({ fullName, email, password }, { onSettled: () => reset() });
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Full name" error={errors?.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          disabled={isSigningUp}
          {...register("fullName", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="Email address" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isSigningUp}
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please provide a valid email address",
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Password (min 8 characters)"
        error={errors?.password?.message}
      >
        <Input
          type="password"
          id="password"
          disabled={isSigningUp}
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 8,
              message: "Password needs a minimum of 8 characters",
            },
          })}
        />
      </FormRow>

      <FormRow label="Repeat password" error={errors?.passwordConfirm?.message}>
        <Input
          type="password"
          id="passwordConfirm"
          disabled={isSigningUp}
          {...register("passwordConfirm", {
            required: "This field is required",
            validate: (value) =>
              value === getValues().password || "Passwords need to match",
          })}
        />
      </FormRow>

      <FormRow>
        <Button variation="secondary" type="reset" disabled={isSigningUp}>
          Cancel
        </Button>
        <Button disabled={isSigningUp}>Create new user</Button>
      </FormRow>
    </Form>
  );
}

export default SignupForm;
```

---

## Understanding React Hook Form Validation

```jsx
{...register("fullName", { required: "This field is required" })}
```

Registers input with validation. Returns `onChange`, `onBlur`, `name`, `ref`.

**Validation rules:**

- `required`: Cannot be empty
- `minLength`: Minimum length check
- `pattern`: Regex validation
- `validate`: Custom validation function

**Cross-field validation:**

```jsx
validate: (value) =>
  value === getValues().password || "Passwords need to match";
```

---

## API Sign Up Function

```js
export async function signup({ fullName, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { fullName, avatar: "" } }, // Metadata
  });

  if (error) throw new Error(error.message);
  return data;
}
```

Creates user in `auth.users`, stores fullName in metadata, sends confirmation email.

## Custom useSignup Hook

```js
export function useSignup() {
  const { mutate: signup, isPending: isSigningUp } = useMutation({
    mutationFn: signupApi,
    onSuccess: () => {
      toast.success("Account created! Please verify your email.");
    },
    onError: (error) => toast.error(error.message),
  });

  return { signup, isSigningUp };
}
```

No navigation — user must verify email first. Form resets via `onSettled` in component.

---

## Complete Sign Up Flow

1. User fills form → validated on blur
2. Clicks "Create" → `handleSubmit` validates all fields
3. If valid → `signup({ fullName, email, password })` called
4. Form disabled during submission
5. Supabase creates user → sends confirmation email
6. Success toast → form resets

---

## Key Benefits

✓ **Client-Side Validation**: Instant feedback before submission  
✓ **Cross-Field Validation**: Password confirmation match  
✓ **Email Verification**: Supabase sends confirmation email  
✓ **Metadata Storage**: Full name stored with user  
✓ **Disabled States**: Prevents duplicate submissions

---

## Important Notes

⚠️ **Email Verification**: Users must verify email before logging in (Supabase default)  
⚠️ **Fixed Typos**: "fullname" → "fullName", "minimun" → "minimum", "Provide" → "provide"  
⚠️ **Metadata vs Profile**: `options.data` is auth metadata, separate from custom profile tables  
⚠️ **Reset Pattern**: Use `onSettled` to reset form regardless of success/error

---

**Next Step:** [Authorization on Supabase](./21-authorization-on-supabase.md)
