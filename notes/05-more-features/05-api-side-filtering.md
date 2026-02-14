# API-Side Filtering

## Overview

API-side filtering performs filtering on the server (database) rather than in the client. This is essential for large datasets where fetching all data would be slow and wasteful.

**Client-side:** Fetch all → filter in JavaScript  
**Server-side:** Filter in database → fetch only what's needed

---

## The Difference: Client vs Server Filtering

### Client-Side Filtering (Cabins)

```jsx
// ❌ Fetches ALL cabins, filters in component
const { data: cabins } = useQuery({ queryKey: ["cabins"], queryFn: getCabins });
const filtered = cabins.filter((cabin) => cabin.discount > 0);
```

**Problem:** With 10,000 cabins, you fetch 10,000 records just to show 50.

### Server-Side Filtering (Bookings)

```jsx
// ✅ Filters in database, fetches only matching records
const { data: bookings } = useQuery({
  queryKey: ["bookings", filter],
  queryFn: () => getBookings({ filter }),
});
```

**Benefit:** With 10,000 bookings, you fetch only the 50 that match the filter.

---

## Reading Filter from URL

### Custom Hook with URL Params

```jsx
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getBookings } from "../services/apiBookings";

export function useBookings() {
  const [searchParams] = useSearchParams();

  // Read filter value from URL (?status=checked-in)
  const filterValue = searchParams.get("status");

  // Build filter object for API
  const filter =
    !filterValue || filterValue === "all"
      ? null // No filter needed
      : { field: "status", value: filterValue }; // Filter by status

  const {
    data,
    isPending: bookingsLoading,
    error: bookingsError,
  } = useQuery({
    queryKey: ["bookings", filter], // Include filter in cache key
    queryFn: () => getBookings({ filter }),
  });

  return { data, bookingsLoading, bookingsError };
}
```

**How It Works:**

- `useSearchParams()`: Reads query params from URL
- `searchParams.get("status")`: Gets value of `?status=checked-in`
- `filter`: Object with `field` and `value`, or `null` for no filter
- `queryKey: ["bookings", filter]`: Different cache for each filter

**Why Include Filter in QueryKey:**

```jsx
// Different filters = different cache entries
["bookings", null][("bookings", { field: "status", value: "checked-in" })][ // All bookings // Checked-in only
  ("bookings", { field: "status", value: "unconfirmed" })
]; // Unconfirmed only
```

---

## API Function with Filtering

### Database Query with Dynamic Filters

```jsx
export async function getBookings({ filter, sortBy }) {
  try {
    // Start building query with joins
    let query = supabase
      .from("bookings")
      .select("*, cabins(name), guests(fullName, email)");

    // Apply filter if provided
    if (filter !== null) {
      query = query[filter.method || "eq"](filter.field, filter.value);
    }

    // Execute query
    const { data, error } = await query;

    if (error) {
      console.log(error.message);
      throw new Error("Bookings could not be loaded");
    }

    return data;
  } catch (error) {
    toast.error(error.message);
  }
}
```

**Understanding the Filter Logic:**

- `query[filter.method || "eq"](filter.field, filter.value)`: Dynamic method call, defaults to "eq"
- `if (filter !== null)`: Only applies filter when provided
- Query chaining: `query = query.eq(...).order(...)` builds complex queries

---

## Filter Object Examples

```js
{ field: "status", value: "checked-in" }           // WHERE status = 'checked-in'
{ field: "totalPrice", value: 1000, method: "gte" } // WHERE totalPrice >= 1000
{ field: "status", value: "cancelled", method: "neq" } // WHERE status != 'cancelled'
```

---

## Complete Flow

1. **URL Changes**: User clicks filter button → URL becomes `?status=checked-in`
2. **Hook Reads URL**: `useSearchParams()` detects change
3. **Filter Built**: `filter = { field: "status", value: "checked-in" }`
4. **Query Key Changes**: `["bookings", filter]` is different from previous
5. **Query Executes**: `getBookings({ filter })` called
6. **Database Filters**: Supabase applies WHERE clause
7. **Limited Data Returned**: Only matching bookings fetched
8. **Cache Stored**: Results cached with filter-specific key
9. **Component Renders**: Displays filtered bookings

---

## Key Benefits

✓ **Performance**: Only fetches needed data, not entire dataset  
✓ **Scalability**: Works with millions of records  
✓ **Server Load**: Database optimized for filtering  
✓ **Network Efficiency**: Smaller data transfer  
✓ **Automatic Caching**: Each filter has its own cache

---

## Important Notes

⚠️ **Query Key**: Must include filter in queryKey for proper caching  
⚠️ **Null Filter**: Check `filter !== null` before applying to query  
⚠️ **Method Defaults**: Use `filter.method || "eq"` for default equality  
⚠️ **URL Sync**: Filter state lives in URL, not component state  
⚠️ **Error Handling**: Always handle errors in API function

---

## Filter UI Example

```jsx
function BookingTableOperations() {
  return (
    <Filter
      filterField="status"
      options={[
        { value: "all", label: "All" },
        { value: "checked-out", label: "Checked out" },
        { value: "checked-in", label: "Checked in" },
        { value: "unconfirmed", label: "Unconfirmed" },
      ]}
    />
  );
}
```

Clicking "Checked in" → URL becomes `?status=checked-in` → Filter applied automatically.

---

**Next Step:** [API-Side Sorting](./06-api-side-sorting.md)
