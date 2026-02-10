# Fetching Cabin Data with React Query

## Database Query Function

### Creating the Data Fetcher

This function retrieves all cabin data from your Supabase database.

```js
export async function getCabins() {
  // Query the 'cabins' table and select all columns
  const { data, error } = await supabase.from("cabins").select("*");

  // Handle any errors that occur during the fetch
  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data; // Return array of cabin objects
}
```

**How It Works:**

- `supabase.from("cabins")`: Targets the cabins table in your database
- `select("*")`: Retrieves all columns for each cabin record
- Error handling ensures failures are caught and logged
- Throwing an error allows React Query to detect and handle failed queries

---

## Using React Query in Components

### Fetching Data with useQuery Hook

React Query handles the entire data fetching lifecycle automatically.

```jsx
import { useQuery } from "@tanstack/react-query";
import { getCabins } from "../services/apiCabins";

function CabinTable() {
  // Fetch cabin data using React Query
  const {
    isPending, // true while data is loading
    data: cabins, // renamed 'data' to 'cabins' for clarity
    error, // contains error object if query fails
  } = useQuery({
    queryKey: ["cabins"], // Unique identifier for this query
    queryFn: getCabins, // Function to fetch the data
  });

  // Show loading spinner while data is fetching
  if (isPending) return <Spinner />;

  // Show error message if query failed
  if (error) return <div>Error loading cabins: {error.message}</div>;

  // Render cabin data once loaded
  return (
    <Table>
      {cabins.map((cabin) => (
        <CabinRow key={cabin.id} cabin={cabin} />
      ))}
    </Table>
  );
}

export default CabinTable;
```

**Understanding useQuery:**

- `queryKey: ["cabins"]`: Cache identifier - React Query uses this to store and retrieve data
- `queryFn: getCabins`: The async function that fetches the data
- `isPending`: Boolean indicating if the query is currently loading (replaces deprecated `isLoading`)
- `data`: The successfully fetched data from your query
- `error`: Contains error information if the fetch fails

**Why This Approach?**

- Automatic caching prevents unnecessary refetches
- Loading and error states handled declaratively
- Background refetching keeps data fresh
- No need for useState or useEffect

---

## Displaying Individual Cabins

### The CabinRow Component

Each cabin is rendered as a table row with its details.

```jsx
function CabinRow({ cabin }) {
  // Destructure cabin properties for easy access
  const { name, maxCapacity, regularPrice, discount, description, image } =
    cabin;

  return (
    <TableRow role="row">
      <Img src={image} alt={name} />
      <Cabin>{name}</Cabin>
      <div>Fits up to {maxCapacity} guests</div>
      <Price>{formatCurrency(regularPrice)}</Price>
      {discount ? (
        <Discount>{formatCurrency(discount)}</Discount>
      ) : (
        <span>—</span>
      )}
      <button>Delete</button>
    </TableRow>
  );
}

export default CabinRow;
```

**Component Breakdown:**

- Receives a single `cabin` object as a prop
- Destructures properties for cleaner code
- Displays cabin image, name, capacity, pricing, and discount
- `formatCurrency()`: Helper function to format prices (e.g., $150.00)
- Delete button prepared for mutation functionality (covered in next section)

---

## Complete Data Flow

1. **Component Mounts**: `CabinTable` renders and triggers `useQuery`
2. **Query Execution**: React Query calls `getCabins()` function
3. **Database Fetch**: Supabase retrieves cabin data from the database
4. **State Updates**: React Query automatically updates `isPending`, `data`, and `error`
5. **Loading State**: Spinner displays while `isPending` is true
6. **Success State**: Once data arrives, cabins are mapped to `CabinRow` components
7. **Rendering**: Each cabin displays in its own row with all details

---

## Key Benefits

✓ **Automatic Caching**: Cabins data is cached and reused across the app  
✓ **No Manual State**: React Query manages loading, error, and data states  
✓ **Background Sync**: Data refetches automatically when stale (based on `staleTime`)  
✓ **Error Handling**: Built-in error detection and recovery  
✓ **Optimistic UI**: Foundation for instant UI updates (useful for mutations)

---

## Important Notes

⚠️ **Query Key**: The `["cabins"]` array must be consistent everywhere you fetch cabin data  
⚠️ **Fixed Typo**: Changed `regulerPrice` to `regularPrice` for correct spelling  
⚠️ **Guest Pluralization**: Changed "guest" to "guests" for grammatical correctness  
⚠️ **Error Display**: Always handle the error state to prevent blank screens on failures

---

## Quick Reference

| Hook Property | Purpose                 | Example Value    |
| ------------- | ----------------------- | ---------------- |
| `queryKey`    | Unique cache identifier | `["cabins"]`     |
| `queryFn`     | Data fetching function  | `getCabins`      |
| `isPending`   | Loading state           | `true/false`     |
| `data`        | Fetched cabin array     | `[{...}, {...}]` |
| `error`       | Error object if failed  | `Error` object   |

---

**Next Step:** [Mutations: Deleting Cabins](./04-mutations-deleting-cabins.md)
