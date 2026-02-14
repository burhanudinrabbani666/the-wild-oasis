# API-Side Pagination

## Overview

API-side pagination fetches only the requested page of data from the database, not all records. This is essential for scalability and performance with large datasets.

**Without pagination:** Fetch 10,000 bookings, show 10  
**With pagination:** Fetch 10 bookings for current page

---

## Reading Pagination from URL

### Custom Hook with Filter, Sort, and Pagination

```js
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getBookings } from "../services/apiBookings";

export function useBookings() {
  const [searchParams] = useSearchParams();

  // 1. FILTER
  const filterValue = searchParams.get("status");
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue };

  // 2. SORT
  const sortByRaw = searchParams.get("sortBy") || "startDate-desc";
  const [field, direction] = sortByRaw.split("-");
  const sortBy = { field, direction };

  // 3. PAGINATION
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  // Query with all parameters
  const {
    data,
    isPending: bookingsLoading,
    error: bookingsError,
  } = useQuery({
    queryKey: ["bookings", filter, sortBy, page], // Include all params in cache key
    queryFn: () => getBookings({ filter, sortBy, page }),
  });

  return { data, bookingsLoading, bookingsError };
}
```

**How It Works:**

- Reads filter, sort, and page from URL
- All params in queryKey for proper caching (different pages = different cache)

---

## API Function with Pagination

### Database Query with Range Limit

```js
import { PAGE_SIZE } from "../utils/constants";

export async function getBookings({ filter, sortBy, page }) {
  try {
    // Start query with count for total records
    let query = supabase.from("bookings").select(
      "*, cabins(name), guests(fullName, email)",
      { count: "exact" }, // Get total count for pagination
    );

    // 1. FILTER
    if (filter) {
      query = query[filter.method || "eq"](filter.field, filter.value);
    }

    // 2. SORT
    if (sortBy) {
      query = query.order(sortBy.field, {
        ascending: sortBy.direction === "asc",
      });
    }

    // 3. PAGINATION
    if (page) {
      const from = (page - 1) * PAGE_SIZE; // Start index
      const to = from + PAGE_SIZE - 1; // End index

      query = query.range(from, to);
    }

    const { data, error, count } = await query;

    if (error) {
      console.log(error);
      throw new Error("Bookings could not be loaded");
    }

    return { data, count };
  } catch (error) {
    toast.error(error.message);
  }
}
```

**Understanding Pagination Logic:**

```js
const from = (page - 1) * PAGE_SIZE; // Start: Page 1 → 0, Page 2 → 10
const to = from + PAGE_SIZE - 1; // End: Page 1 → 9, Page 2 → 19
query = query.range(from, to); // Supabase limits results (0-based, inclusive)
```

**Examples (PAGE_SIZE = 10):** Page 1: Records 0-9, Page 2: Records 10-19, Page 3: Records 20-29

**count: "exact"** returns total matching records for calculating total pages.

---

## Complete Flow

1. User clicks "Page 2" → URL: `?page=2`
2. Hook reads URL → `page = 2`
3. Query key: `["bookings", filter, sortBy, 2]`
4. Check cache → if not found, call API
5. Calculate range: `from = 10, to = 19`
6. Database query: `SELECT ... LIMIT 10 OFFSET 10`
7. Returns 10 records + count (e.g., 95 total)
8. Cache stored → UI shows "Showing 11 to 20 of 95"

---

## Returned Data Structure

```js
{
  data: [{ id: 11, status: "checked-in", ... }, /* ... 9 more */],
  count: 95  // Total matching bookings (for calculating total pages)
}
```

---

## Key Benefits

✓ **Performance**: Only fetches needed data, not entire dataset  
✓ **Scalability**: Works with millions of records  
✓ **Network Efficiency**: Smaller payloads  
✓ **Database Optimized**: LIMIT/OFFSET handled by database  
✓ **Accurate Count**: Total count reflects current filters

---

## Important Notes

⚠️ **Include count: "exact"**: Required to get total count for pagination  
⚠️ **0-based indexing**: Supabase range is 0-based and inclusive  
⚠️ **PAGE_SIZE constant**: Must match between UI and API  
⚠️ **Query Key**: Include page in queryKey for proper caching  
⚠️ **Return both data and count**: Pagination component needs total count  
⚠️ **Filter affects count**: Count is total matching records, not all records

---

## Usage with Pagination Component

```jsx
function BookingTable() {
  const { data, bookingsLoading } = useBookings();

  if (bookingsLoading) return <Spinner />;

  const { data: bookings, count } = data;

  return (
    <>
      <Table data={bookings} />
      <Pagination count={count} />
    </>
  );
}
```

**Flow:**

- `count` passed to Pagination component
- Pagination calculates total pages: `Math.ceil(count / PAGE_SIZE)`
- User clicks page → URL updates → new data fetched

---

**Next Step:** [Prefetching with React Query](./09-prefetching-with-react-query.md)
