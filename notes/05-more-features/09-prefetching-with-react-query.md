# Prefetching with React Query

## Overview

Prefetching loads data before it's needed, improving perceived performance. When users navigate to the next page, the data is already cached and displays instantly.

**Without prefetching:** Click next → wait for data → see results  
**With prefetching:** Click next → see results instantly (already cached)

---

## The Prefetching Strategy

### Current Page + Adjacent Pages

The ideal strategy for pagination is to prefetch:

- **Next page**: Very likely to be visited
- **Previous page**: Likely if user goes back

This provides instant navigation in both directions while minimizing unnecessary requests.

---

## Implementation

### Complete Hook with Prefetching

```js
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getBookings } from "../services/apiBookings";
import { PAGE_SIZE } from "../utils/constants";

export function useBookings() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // Filter
  const filterValue = searchParams.get("status");
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue };

  // Sort
  const sortByRaw = searchParams.get("sortBy") || "startDate-desc";
  const [field, direction] = sortByRaw.split("-");
  const sortBy = { field, direction };

  // Pagination
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  // FETCH CURRENT PAGE
  const {
    data: { data: bookings, count } = {},
    isPending: bookingsLoading,
    error: bookingsError,
  } = useQuery({
    queryKey: ["bookings", filter, sortBy, page],
    queryFn: () => getBookings({ filter, sortBy, page }),
  });

  // PREFETCH NEXT AND PREVIOUS PAGES
  const pageCount = Math.ceil(count / PAGE_SIZE);

  // Prefetch next page
  if (page < pageCount) {
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page + 1],
      queryFn: () => getBookings({ filter, sortBy, page: page + 1 }),
    });
  }

  // Prefetch previous page
  if (page > 1) {
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page - 1],
      queryFn: () => getBookings({ filter, sortBy, page: page - 1 }),
    });
  }

  return { bookings, count, bookingsLoading, bookingsError };
}
```

---

## How It Works

### Understanding prefetchQuery

```js
queryClient.prefetchQuery({
  queryKey: ["bookings", filter, sortBy, page + 1],
  queryFn: () => getBookings({ filter, sortBy, page: page + 1 }),
});
```

**What happens:**

1. React Query checks if data with this queryKey is cached
2. If not cached or stale, it fetches the data
3. Data is stored in cache silently (no loading state shown)
4. When user navigates to that page, data is already available

**Key difference from useQuery:**

- `useQuery`: Shows loading state, triggers component re-render
- `prefetchQuery`: Background operation, no loading state, no re-render

---

## Conditional Prefetching

### Only Prefetch Valid Pages

```js
const pageCount = Math.ceil(count / PAGE_SIZE);

// Only prefetch if next page exists
if (page < pageCount) {
  queryClient.prefetchQuery({
    /* next page */
  });
}

// Only prefetch if previous page exists
if (page > 1) {
  queryClient.prefetchQuery({
    /* previous page */
  });
}
```

**Why conditionals?**

- Page 1: Don't prefetch page 0 (doesn't exist)
- Last page: Don't prefetch beyond total pages
- Prevents unnecessary API calls

**Examples:**

- **Page 1 of 10**: Prefetch page 2 only
- **Page 5 of 10**: Prefetch pages 4 and 6
- **Page 10 of 10**: Prefetch page 9 only

---

## Complete Flow

1. **User on Page 2**: Current data fetched and displayed
2. **Prefetch Triggers**: After current page loads
3. **Check Next Page**: `2 < 10` → true
4. **Prefetch Page 3**: `getBookings({ page: 3 })` called in background
5. **Check Previous Page**: `2 > 1` → true
6. **Prefetch Page 1**: `getBookings({ page: 1 })` called in background
7. **Data Cached**: Pages 1 and 3 now in cache
8. **User Clicks Next**: Navigates to page 3
9. **Instant Display**: Page 3 data already cached, shows immediately
10. **New Prefetch**: Now prefetches pages 2 and 4

---

## Key Benefits

✓ **Instant Navigation**: Adjacent pages load instantly  
✓ **Better UX**: No waiting between pages  
✓ **Smart Caching**: Only prefetches likely-needed pages  
✓ **Automatic**: Happens in background, no user awareness  
✓ **Efficient**: Prevents unnecessary requests with conditionals

---

## Important Notes

⚠️ **useQueryClient Required**: Must call `useQueryClient()` to access prefetch methods  
⚠️ **Same QueryKey**: Prefetch queryKey must match the useQuery queryKey format  
⚠️ **Conditional Checks**: Always check if page exists before prefetching  
⚠️ **Count Dependency**: Need `count` from current query to calculate `pageCount`  
⚠️ **Background Operation**: Prefetch doesn't trigger loading states or re-renders

---

## Advanced: Prefetch Multiple Pages

```js
// Prefetch next 2 pages for even faster navigation
if (page < pageCount) {
  queryClient.prefetchQuery({ queryKey: ["bookings", filter, sortBy, page + 1], ... });
}
if (page + 1 < pageCount) {
  queryClient.prefetchQuery({ queryKey: ["bookings", filter, sortBy, page + 2], ... });
}
```

**Trade-off:** More instant pages vs more API calls/memory.

---

## When to Use Prefetching

**✅ Use:** Pagination, tabs, drill-down interfaces, predictable navigation  
**❌ Don't use:** Unpredictable paths, very large datasets, limited bandwidth

---

**Next Step:** [Building the Single Booking Page](./10-building-the-single-booking-page.md)
