# React Query Setup Guide

## Installation

### Required Packages

Install both React Query and its DevTools for optimal development experience.

```bash
# Install React Query core library
npm i @tanstack/react-query

# Install React Query DevTools (for debugging)
npm i @tanstack/react-query-devtools
```

**What You're Installing:**

- `@tanstack/react-query`: The main library for server state management
- `@tanstack/react-query-devtools`: Visual debugging tool to inspect queries and cache

---

## Configuration

### Setting Up the Query Client

The Query Client manages all queries and their cache in your application.

```jsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Create a client with default configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // Data stays fresh for 60 seconds (60,000ms)
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* DevTools panel - only visible in development */}
      <ReactQueryDevtools initialIsOpen={false} />

      <GlobalStyle />
      {/* Your app components go here */}
    </QueryClientProvider>
  );
}

export default App;
```

**Understanding the Configuration:**

- `QueryClient`: Creates a new instance to manage all queries
- `staleTime: 60 * 1000`: Cached data is considered "fresh" for 60 seconds before refetching
- `QueryClientProvider`: Provides the query client to all child components
- `ReactQueryDevtools`: Shows a floating icon to inspect queries (hidden by default with `initialIsOpen={false}`)

---

## How It Works

### The React Query Flow

1. **Provider Setup**: Wrap your app with `QueryClientProvider` to enable React Query throughout
2. **Cache Management**: The `queryClient` stores and manages all fetched data
3. **Stale Time**: Data remains "fresh" for 60 seconds, preventing unnecessary refetches
4. **DevTools Access**: Development tool helps you visualize cache state and query behavior

### Why This Configuration?

**60-Second Stale Time:**

- Reduces unnecessary API calls for frequently accessed data
- Balances data freshness with performance
- Can be adjusted per query or globally based on your needs

**DevTools Integration:**

- Inspect which queries are active, stale, or fetching
- View cached data in real-time
- Debug refetch behavior and timing

---

## Key Benefits

✓ **Automatic Caching**: Fetched data is cached and reused across components  
✓ **Background Updates**: Stale data refetches automatically in the background  
✓ **DevTools Debugging**: Visual insight into all query states and cached data  
✓ **Performance Optimization**: Prevents duplicate requests for the same data  
✓ **Global Configuration**: Set default behavior once, customize per query when needed

---

## Important Notes

⚠️ **Provider Placement**: `QueryClientProvider` must wrap all components that use React Query hooks  
⚠️ **Stale Time vs Cache Time**: `staleTime` determines when to refetch, `cacheTime` determines when to remove unused data from cache (default: 5 minutes)  
⚠️ **DevTools in Production**: DevTools are automatically excluded from production builds

---

## Quick Reference

| Setting         | Value          | Purpose                         |
| --------------- | -------------- | ------------------------------- |
| `staleTime`     | 60,000ms (60s) | How long data stays fresh       |
| `initialIsOpen` | false          | DevTools panel starts collapsed |

---

**Next Step:** [Fetching Cabin Data](./03-fetching-cabin-data.md)
