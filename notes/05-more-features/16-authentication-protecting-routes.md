# Authorization — Protecting Routes

## Overview

Protected routes prevent unauthenticated users from accessing the application. If a user is not logged in, they're redirected to the login page. This uses React Router's layout routes with a wrapper component.

---

## API: Get Current User

```js
export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);

  return data?.user;
}
```

Checks localStorage for session, then verifies with Supabase. Returns `null` if no session.

---

## Custom useUser Hook

```js
export function useUser() {
  const { data: user, isPending: isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });

  return { user, isLoading, isAuthenticated: user?.role === "authenticated" };
}
```

Caches user app-wide. `isAuthenticated` checks if `role === "authenticated"` (Supabase's indicator).

---

## ProtectedRoute Component

```jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../features/authentication/useUser";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useUser();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) navigate("/login");
  }, [isAuthenticated, navigate, isLoading]);

  if (isLoading) return <FullPageSpinner />;
  if (isAuthenticated) return children;
  return null; // During redirect
}
```

**Flow:** Check auth → if loading show spinner → if not authenticated redirect → if authenticated render.

---

## Using ProtectedRoute in App

```jsx
// App.jsx
<Routes>
  <Route path="/login" element={<Login />} />

  <Route
    element={
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<Navigate replace to="dashboard" />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="bookings" element={<Bookings />} />
    {/* All nested routes protected */}
  </Route>
</Routes>
```

`ProtectedRoute` wraps `AppLayout` → all nested routes inherit protection.

---

## Caching User on Login

```js
onSuccess: (data) => {
  queryClient.setQueryData(["user"], data.user); // Cache user from login response
  navigate("/dashboard", { replace: true });
};
```

Sets user in cache to avoid refetching. Makes navigation instant.

---

## Clearing Form on Submit

```jsx
login(
  { email, password },
  {
    onSettled: () => {
      setEmail("");
      setPassword("");
    },
  },
);
```

`onSettled` runs on both success and error. Clears form for fresh retry.

---

## Complete Protection Flow

1. User navigates to `/dashboard`
2. `ProtectedRoute` renders → `useUser()` called
3. `getCurrentUser()` checks session
4. **If no session**: `isAuthenticated = false` → redirect to `/login`
5. **If session exists**: `isAuthenticated = true` → render children
6. User logs in → `setQueryData` caches user → navigate to `/dashboard`
7. `ProtectedRoute` checks again → user in cache → instant access

---

## Key Benefits

✓ **Single Point of Protection**: One component guards entire app  
✓ **Cached User Data**: No redundant API calls after login  
✓ **Loading States**: Spinner during auth check  
✓ **Instant Navigation**: User data cached on login  
✓ **Nested Routes**: All child routes automatically protected

---

## Important Notes

⚠️ **Fixed Bug**: Original `return null` after session check, should be `return null;`  
⚠️ **Check Loading**: Always check `!isLoading` before redirecting  
⚠️ **setQueryData**: First arg is `["user"]`, second is `data.user` (not whole response)  
⚠️ **Role Check**: `user?.role === "authenticated"` is Supabase's auth indicator  
⚠️ **Safety Return**: Add `return null` after conditional to prevent React warnings

---

**Next Step:** [User Logout](./17-user-logout.md)
