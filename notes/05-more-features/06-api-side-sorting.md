# API-Side Sorting

## Overview

API-side sorting performs sorting on the server (database) rather than in the client. Like filtering, this is essential for large datasets and provides better performance.

**Client-side:** Fetch all → sort in JavaScript  
**Server-side:** Sort in database → fetch pre-sorted results

---

## Reading Sort from URL

### Parse Sort Parameters

```js
import { useSearchParams } from "react-router-dom";

export function useBookings() {
  const [searchParams] = useSearchParams();

  // FILTER
  const filterValue = searchParams.get("status");
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue };

  // SORT - Parse from URL (?sortBy=startDate-desc)
  const sortByRaw = searchParams.get("sortBy") || "startDate-desc";
  const [field, direction] = sortByRaw.split("-");
  const sortBy = { field, direction };

  const {
    data,
    isPending: bookingsLoading,
    error: bookingsError,
  } = useQuery({
    queryKey: ["bookings", filter, sortBy], // Include sortBy in cache key
    queryFn: () => getBookings({ filter, sortBy }),
  });

  return { data, bookingsLoading, bookingsError };
}
```

**Understanding:**

- `searchParams.get("sortBy") || "startDate-desc"`: Read from URL, default to date descending
- `sortByRaw.split("-")`: Split `"totalPrice-asc"` into `["totalPrice", "asc"]`
- `{ field, direction }`: Create object for API
- Include in queryKey: Different sorts = different cache

---

## API Function with Sorting

### Database Query with Dynamic Sort

```js
export async function getBookings({ filter, sortBy }) {
  try {
    let query = supabase
      .from("bookings")
      .select("*, cabins(name), guests(fullName, email)");

    // Apply filter
    if (filter !== null) {
      query = query[filter.method || "eq"](filter.field, filter.value);
    }

    // Apply sort
    if (sortBy) {
      query = query.order(sortBy.field, {
        ascending: sortBy.direction === "asc",
      });
    }

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

**How It Works:**

- `query.order(field, { ascending: boolean })`: Supabase order method
- `ascending: sortBy.direction === "asc"`: `true` for asc, `false` for desc
- Multiple sorts: Chain `.order()` calls

---

## Sort Examples

```js
{ field: "startDate", direction: "desc" }  // Newest first
{ field: "startDate", direction: "asc" }   // Oldest first
{ field: "totalPrice", direction: "desc" } // Highest price first
```

**URL Examples:**

- `?sortBy=startDate-desc` → Recent bookings first
- `?sortBy=totalPrice-asc` → Cheapest bookings first

---

## Complete Sort Flow

1. User selects sort → URL becomes `?sortBy=totalPrice-desc`
2. `useSearchParams()` detects change
3. Parse: `"totalPrice-desc"` → `{ field: "totalPrice", direction: "desc" }`
4. Query key changes → triggers new query
5. Database sorts with `ORDER BY totalPrice DESC`
6. Pre-sorted results cached and displayed

---

## Combining Filter and Sort

```js
// URL: ?status=checked-in&sortBy=startDate-desc
const filter = { field: "status", value: "checked-in" };
const sortBy = { field: "startDate", direction: "desc" };

// SQL: SELECT * FROM bookings
// WHERE status = 'checked-in' ORDER BY startDate DESC
```

**Query Key:**

```js
[
  "bookings",
  { field: "status", value: "checked-in" },
  { field: "startDate", direction: "desc" },
];
```

---

## Key Benefits

✓ **Performance**: Database-optimized sorting  
✓ **Scalability**: Works with millions of records  
✓ **Memory Efficient**: No client-side sorting overhead  
✓ **Automatic Caching**: Each sort has its own cache

---

## Important Notes

⚠️ **Query Key**: Must include `sortBy` in queryKey for caching  
⚠️ **Default Sort**: Always provide default for consistent behavior  
⚠️ **URL Format**: Use `field-direction` format (e.g., `startDate-desc`)  
⚠️ **Direction Values**: Only `"asc"` or `"desc"` are valid  
⚠️ **Field Names**: Must match database column names exactly

---

## Sort UI Example

```jsx
<SortBy
  options={[
    { value: "startDate-desc", label: "Sort by date (recent first)" },
    { value: "startDate-asc", label: "Sort by date (earlier first)" },
    { value: "totalPrice-desc", label: "Sort by amount (high first)" },
    { value: "totalPrice-asc", label: "Sort by amount (low first)" },
  ]}
/>
```

Selecting option updates URL → Sort applied automatically.

---

**Next Step:** [Building Reusable Pagination](./07-building-a-reusable-pagination.md)
