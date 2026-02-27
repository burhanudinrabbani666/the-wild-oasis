# Error Boundaries

## Overview

Error boundaries catch JavaScript errors anywhere in the component tree and display a fallback UI instead of crashing the entire app. Uses the `react-error-boundary` library for a production-ready solution.

---

## Installation

```bash
npm install react-error-boundary
# or
bun install react-error-boundary
```

---

## Wrapping the App

```jsx
// main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import App from "./App";
import ErrorFallback from "./ui/ErrorFallback";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.replace("/")}
    >
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
```

**How It Works:**

- `FallbackComponent`: Component to render when error occurs
- `onReset`: Called when user clicks "Try again" button
- `window.location.replace("/")`: Navigates to home and reloads app

**Why wrap at root?**

- Catches errors from entire app
- Prevents complete white screen
- Single error boundary for all routes

---

## Error Fallback Component

```jsx
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <>
      <GlobalStyles />
      <StyledErrorFallback>
        <Box>
          <Heading as="h1">Something went wrong 🧐</Heading>
          <p>{error.message}</p>
          <Button size="large" onClick={resetErrorBoundary}>
            Try again
          </Button>
        </Box>
      </StyledErrorFallback>
    </>
  );
}
```

**Props:** `error` (error object), `resetErrorBoundary` (reset function).

---

## What Errors Are Caught?

**✅ Caught by Error Boundaries:**

- Rendering errors (undefined property access)
- Lifecycle method errors
- Constructor errors
- Event handler errors (when they affect rendering)

**❌ Not Caught by Error Boundaries:**

- Event handlers (use try-catch)
- Async code (promises, setTimeout)
- Server-side rendering
- Errors in the error boundary itself

---

## Handling Event Handler Errors

```jsx
// Event handlers need try-catch
function handleClick() {
  try {
    riskyOperation();
  } catch (error) {
    toast.error(error.message);
  }
}
```

Error boundaries don't catch errors in event handlers. Use try-catch or React Query's error handling.

---

## Multiple Error Boundaries (Optional)

```jsx
// Feature-level boundary for isolated error handling
<ErrorBoundary FallbackComponent={FeatureErrorFallback}>
  <ComplexFeature />
</ErrorBoundary>
```

Isolates errors to specific features. Rest of app continues working.

---

## Complete Error Flow

1. Error thrown → bubbles to error boundary
2. Fallback UI renders with error message
3. User clicks "Try again" → `onReset` → reload app from home

---

## Key Benefits

✓ **Graceful Degradation**: App doesn't crash completely  
✓ **User-Friendly**: Clear error message instead of blank screen  
✓ **Recovery Option**: "Try again" button to reload  
✓ **Production-Ready**: Prevents total app failure  
✓ **Better UX**: Users understand something went wrong

---

## Important Notes

⚠️ **Development vs Production**: In dev, React shows error overlay first, then fallback  
⚠️ **Event Handlers**: Must use try-catch, not caught by error boundary  
⚠️ **Async Errors**: Use React Query's error handling for API calls  
⚠️ **Error Logging**: Add error logging service (Sentry, LogRocket) in production  
⚠️ **Fixed Typo**: "boundries" → "boundaries"

---

## Production Error Logging

```jsx
<ErrorBoundary
  FallbackComponent={ErrorFallback}
  onReset={() => window.location.replace("/")}
  onError={(error, errorInfo) => {
    // Log to error tracking service
    console.error("Error caught by boundary:", error, errorInfo);
    // Sentry.captureException(error);
  }}
>
  <App />
</ErrorBoundary>
```

Track errors in production with services like Sentry or LogRocket.

---

**Next Step:** [Final Touch and Fixing Bugs](./31-final-touch-and-fixing-bugs.md)
