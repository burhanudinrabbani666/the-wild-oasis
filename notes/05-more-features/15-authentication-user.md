# Authentication — User Login with Supabase

## Overview

Supabase provides built-in authentication. Users are stored in Supabase's `auth.users` table and sign in with email and password. This guide covers the full login flow from API to component.

> ⚠️ **Development Note:** Hardcoded credentials in state are for development only. Remove before deploying to production.

---

## Setup: Create a User in Supabase

Open Supabase → **Authentication → Users** → **Invite/Add User** → enter email and password.

---

## API Login Function

```js
// apiAuth.js
import supabase from "./supabase";

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return data; // Contains user object and session token
}
```

**How It Works:**

- `signInWithPassword`: Supabase built-in auth method
- Returns `data.user` (user info) and `data.session` (JWT token)
- Supabase automatically stores session in localStorage
- Throws error with Supabase's error message on failure

---

## Custom useLogin Hook

```js
// useLogin.js
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { login as loginApi } from "../services/apiAuth";

export function useLogin() {
  const navigate = useNavigate();

  const { mutate: login, isPending: isLoggingIn } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),

    onSuccess: () => {
      navigate("/dashboard", { replace: true }); // Replace history entry
    },

    onError: () => {
      toast.error("Provided email or password is incorrect");
    },
  });

  return { login, isLoggingIn };
}
```

**How It Works:**

- `mutationFn`: Calls login API with email and password
- `navigate("/dashboard", { replace: true })`: Redirects on success, replaces history so back button doesn't return to login
- `onError`: Shows toast instead of exposing raw error to user

**Why replace: true?**

- Without it, users could press back → return to login page
- With it, back navigation goes to page before login

---

## Login Form Component

```jsx
// LoginForm.jsx
import { useState } from "react";
import { useLogin } from "../features/authentication/useLogin";

function LoginForm() {
  // DEV ONLY: Remove default values before production
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("");

  const { login, isLoggingIn } = useLogin();

  function handleSubmit(event) {
    event.preventDefault();

    // Guard: Don't submit if fields are empty
    if (!email || !password) return;

    login({ email, password });
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormRowVertical label="Email address">
        <Input
          type="email"
          id="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoggingIn}
        />
      </FormRowVertical>

      <FormRowVertical label="Password">
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoggingIn}
        />
      </FormRowVertical>

      <Button type="submit" size="large" disabled={isLoggingIn}>
        {isLoggingIn ? "Logging in..." : "Log in"}
      </Button>
    </form>
  );
}

export default LoginForm;
```

**Understanding the Form:**

- `event.preventDefault()`: Prevents browser default form submission
- Guard clause `if (!email || !password) return`: Early exit for empty fields
- `disabled={isLoggingIn}`: Prevents duplicate submissions during login
- `autoComplete`: Helps browsers with password managers

---

## Complete Login Flow

1. User fills in email and password
2. Clicks "Log in" → `handleSubmit` fires
3. Guard check: both fields must have values
4. `login({ email, password })` mutation triggers
5. Inputs disabled — `isLoggingIn = true`
6. Supabase `signInWithPassword` called
7. **Success**: Session stored → navigate to `/dashboard`
8. **Error**: Toast shown: "Provided email or password is incorrect"

---

## Key Benefits

✓ **Built-in Auth**: No custom backend needed  
✓ **Session Management**: Supabase handles JWT tokens automatically  
✓ **Persistent Login**: Session stored in localStorage, survives page reload  
✓ **Disabled State**: Prevents duplicate requests during login  
✓ **Clean Error Messages**: User-friendly errors instead of raw API messages

---

## Important Notes

⚠️ **Remove Hardcoded Credentials**: Never ship default email/password to production  
⚠️ **replace: true**: Prevents navigating back to login page after success  
⚠️ **RLS Policies**: Supabase auth integrates with Row Level Security  
⚠️ **Session Auto-Refresh**: Supabase automatically refreshes expired tokens  
⚠️ **Auth vs Data**: User data is in `auth.users`, not your custom tables

---

## Getting Current User

```js
export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);

  return data?.user;
}
```

Use this in a `useUser` hook to access the logged-in user anywhere in the app.

---

**Next Step:** [Authorization — Protecting Routes](./16-authentication-protecting-routes.md)
