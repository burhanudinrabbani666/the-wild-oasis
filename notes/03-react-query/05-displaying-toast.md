# Toast Notifications with React Hot Toast

## Overview

React Hot Toast provides beautiful, customizable notifications for user feedback. It's lightweight, accessible, and easy to integrate.

📚 **Official Documentation**: [react-hot-toast.com](https://react-hot-toast.com/docs)

---

## Installation

### Adding React Hot Toast to Your Project

```bash
npm i react-hot-toast
```

**What You're Installing:**

- Lightweight toast notification library (~5KB)
- Supports success, error, loading, and custom notifications
- Built-in animations and positioning options
- Fully customizable styling

---

## Global Configuration

### Setting Up the Toaster Component

Add the `<Toaster />` component once in your root App component to enable toasts throughout your application.

```jsx
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Toast notification container */}
      <Toaster
        position="top-center" // Where toasts appear on screen
        gutter={12} // Space between multiple toasts (in pixels)
        containerStyle={{ margin: "8px" }} // Container spacing from viewport edge
        toastOptions={{
          // Success toast configuration
          success: {
            duration: 3000, // Show for 3 seconds
          },

          // Error toast configuration
          error: {
            duration: 5000, // Show for 5 seconds (longer for errors)
          },

          // Default styles applied to all toasts
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "var(--color-grey-0)", // Light background
            color: "var(--color-grey-700)", // Dark text for readability
          },
        }}
      />

      <GlobalStyle />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
```

**Understanding the Configuration:**

- `position`: Controls where toasts appear (top-center, top-right, bottom-left, etc.)
- `gutter`: Vertical spacing between stacked toasts
- `containerStyle`: Margin around the entire toast container
- `toastOptions`: Global defaults for all toast types
- `duration`: How long toasts remain visible (in milliseconds)
- `style`: Custom CSS applied to all toasts (can be overridden per toast)

**Why These Durations?**

- Success: 3 seconds (quick confirmation, user doesn't need to read much)
- Error: 5 seconds (gives users time to read error messages)

---

## Using Toasts in Components

### Replacing Alerts with Toast Notifications

Import and use the `toast` function to display notifications in your components.

```jsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast"; // Import the toast function
import { deleteCabin } from "../services/apiCabins";

function CabinRow({ cabin }) {
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: (id) => deleteCabin(id),

    onSuccess: () => {
      // Show success toast instead of alert()
      toast.success("Cabin successfully deleted");

      // Invalidate cache to refresh the cabin list
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },

    onError: (error) => {
      // Show error toast with the error message
      toast.error(error.message);
    },
  });

  return (
    <TableRow role="row">
      {/* ... cabin row content ... */}
      <button onClick={() => mutate(cabin.id)} disabled={isPending}>
        {isPending ? "Deleting..." : "Delete"}
      </button>
    </TableRow>
  );
}

export default CabinRow;
```

**How It Works:**

- `toast.success(message)`: Displays a green success toast
- `toast.error(message)`: Displays a red error toast
- Toasts appear automatically and dismiss based on configured duration
- Multiple toasts stack vertically with the configured gutter spacing
- No need to manage toast state manually - react-hot-toast handles everything

---

## Complete Toast Flow

1. **App Initialization**: `<Toaster />` is rendered in the root component
2. **User Action**: User clicks delete button, triggering a mutation
3. **Mutation Starts**: Optional loading toast can be shown
4. **Success Path**:
   - Mutation completes successfully
   - `onSuccess` callback fires
   - `toast.success()` displays a green notification
   - Toast appears at top-center for 3 seconds
   - Toast automatically fades out
5. **Error Path**:
   - Mutation fails
   - `onError` callback fires
   - `toast.error()` displays a red notification
   - Toast appears at top-center for 5 seconds
   - User has time to read the error message

---

## Key Benefits

✓ **Better UX**: Non-intrusive notifications vs. blocking `alert()` dialogs  
✓ **Accessible**: Built-in ARIA attributes for screen readers  
✓ **Customizable**: Full control over styling, position, and duration  
✓ **Auto-Dismiss**: Toasts disappear automatically (no manual cleanup)  
✓ **Stack Management**: Multiple toasts are queued and displayed gracefully  
✓ **Promise Support**: Easy integration with async operations

---

## Important Notes

⚠️ **Single Toaster**: Only add `<Toaster />` once in your App component, not in every component  
⚠️ **Import Correctly**: Import `toast` (function) for triggering, `Toaster` (component) for setup  
⚠️ **CSS Variables**: Ensure your CSS variables (e.g., `--color-grey-0`) are defined globally  
⚠️ **Accessibility**: Default ARIA labels are good, but you can customize for better context

---

## Customization Tips

**Custom Icon:** `toast.success("Deleted", { icon: "🗑️" })`  
**Custom Duration:** `toast.error("Error", { duration: 4000 })`  
**Custom Position:** `toast("Message", { position: "bottom-right" })`  
**Dismiss Programmatically:** `toast.dismiss(toastId)`

---

**Next Step:** [React Hook Form](./06-react-hook-form.md)
