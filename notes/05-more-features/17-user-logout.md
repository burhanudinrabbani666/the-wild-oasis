# User Logout

## Overview

Logging out removes the user's session from Supabase and clears all cached data from React Query. The user is then redirected to the login page.

---

## API Logout Function

```js
// apiAuth.js
export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) throw new Error(error.message);
}
```

**How It Works:**

- `signOut()`: Supabase built-in method
- Removes session from localStorage
- Invalidates JWT token on server
- User must log in again to access app

---

## Custom useLogout Hook

```js
// useLogout.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logout as logoutApi } from "../services/apiAuth";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: logoutApi,

    onSuccess: () => {
      queryClient.removeQueries(); // Clear ALL cached data
      navigate("/login", { replace: true });
    },
  });

  return { logout, isLoggingOut };
}
```

**Understanding the Hook:**

- `removeQueries()`: Clears entire React Query cache (user, bookings, cabins, etc.)
- `navigate("/login", { replace: true })`: Redirects and replaces history
- No toast notification needed — logout is expected action

**Why remove all queries?**

- Cached data belongs to logged-in user
- Next user shouldn't see previous user's data
- Fresh start for new login session

**Why `replace: true`?**

- Prevents back button from going to authenticated pages
- Clicking back from login won't show protected routes

---

## Logout Button Component

```jsx
// Logout.jsx
import { HiArrowRightOnRectangle } from "react-icons/hi2";
import { useLogout } from "../features/authentication/useLogout";
import ButtonIcon from "../ui/ButtonIcon";
import SpinnerMini from "../ui/SpinnerMini";

function Logout() {
  const { logout, isLoggingOut } = useLogout();

  return (
    <ButtonIcon disabled={isLoggingOut} onClick={logout}>
      {!isLoggingOut ? <HiArrowRightOnRectangle /> : <SpinnerMini />}
    </ButtonIcon>
  );
}

export default Logout;
```

**How It Works:**

- Shows logout icon normally
- Shows spinner while logging out
- Button disabled during logout to prevent double-click

---

## Using in Header

```jsx
// Header.jsx
function Header() {
  return (
    <StyledHeader>
      <UserAvatar />
      <Logout />
    </StyledHeader>
  );
}
```

---

## Complete Logout Flow

1. User clicks logout button
2. `logout()` mutation triggers
3. Button disabled → spinner shows
4. `logoutApi()` calls Supabase `signOut()`
5. Session removed from localStorage
6. `onSuccess` callback fires:
   - All React Query cache cleared
   - Navigate to `/login` (replaces history)
7. `ProtectedRoute` detects no user → stays on login
8. User sees login page

---

## Key Benefits

✓ **Clean Logout**: All user data cleared from cache  
✓ **Session Removal**: Supabase handles token invalidation  
✓ **No Back Navigation**: Can't navigate back to protected routes  
✓ **Loading State**: Spinner during logout process  
✓ **Complete Reset**: Next login starts fresh

---

## Important Notes

⚠️ **removeQueries() vs invalidateQueries()**: `removeQueries()` deletes cached data, `invalidateQueries()` just marks as stale  
⚠️ **No Arguments**: `removeQueries()` with no args removes ALL queries  
⚠️ **replace: true**: Essential to prevent back navigation to protected pages  
⚠️ **Fixed Typo**: "chace" → "cache", "logoutLoading" → "isLoggingOut"

---

## Alternative: Clear Specific Queries

```js
// If you want to keep some cached data (like settings)
onSuccess: () => {
  queryClient.removeQueries({ queryKey: ["user"] });
  queryClient.removeQueries({ queryKey: ["bookings"] });
  queryClient.removeQueries({ queryKey: ["cabins"] });
  // Keep settings, etc.
  navigate("/login", { replace: true });
};
```

Most apps use `removeQueries()` to clear everything for security.

---

## Comparison: Login vs Logout

| Action     | Session                   | Cache          | Navigation     |
| ---------- | ------------------------- | -------------- | -------------- |
| **Login**  | Created in localStorage   | Set user data  | → `/dashboard` |
| **Logout** | Removed from localStorage | Clear all data | → `/login`     |

---

**Next Step:** [Fixing an Important Bug](./18-fixing-an-important-bug.md)
