# Supabase Integration Guide

## Initial Setup

### Creating the Supabase Client

This configuration establishes a connection to your Supabase database using a read-only API key for secure data fetching.

```js
import { createClient } from "@supabase/supabase-js";

// Your Supabase project URL
const supabaseUrl = "https://oobhmhdqjancbyfnwdul.supabase.co";

// Read-only (anon) API key - safe for client-side use
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vYmhtaGRxamFuY2J5Zm53ZHVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NTU0OTAsImV4cCI6MjA4NjIzMTQ5MH0.skWCWrV8fDs0Ikp9ORLasdAsTnTujcn6YVNKRqmEW4E";

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
```

**Understanding the Setup:**

- `supabaseUrl`: The unique endpoint for your Supabase project
- `supabaseKey`: The anonymous (public) API key with read-only permissions protected by Row Level Security (RLS)
- `createClient()`: Initializes the connection to your database
- Exporting the client allows reuse across your application

---

## Fetching Data

### Creating a Data Retrieval Function

```js
export async function getCabins() {
  // Query the 'cabins' table and select all columns
  const { data, error } = await supabase.from("cabins").select("*");

  // Handle errors explicitly
  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}
```

**How It Works:**

- `from("cabins")`: Specifies the database table to query
- `select("*")`: Retrieves all columns from the table
- Destructures the response into `data` (results) and `error` (any issues)
- Throws a custom error if the query fails, making debugging easier
- Returns the cabin data array on success

---

## Using in React Components

### Fetching Data on Component Mount

```jsx
import { useEffect } from "react";
import { getCabins } from "./path-to-your-api-file";

useEffect(() => {
  // Fetch cabins when component first renders
  getCabins().then((data) => console.log(data));
}, []); // Empty dependency array = runs once on mount
```

**Understanding the Hook:**

- `useEffect`: Runs side effects (like data fetching) in React components
- Empty `[]`: Ensures the effect runs only once when the component mounts
- `.then()`: Handles the async response and logs the cabin data

**Best Practice Note:** For production code, consider using React Query or storing the data in state rather than just logging it.

---

## Complete Integration Flow

1. **Initialize Connection**: Create a Supabase client with your project credentials
2. **Define API Functions**: Build reusable functions to interact with specific tables
3. **Call from Components**: Use React hooks to fetch data when components load
4. **Handle Responses**: Process successful data or manage errors appropriately

---

## Key Benefits

✓ **Secure by Default**: Read-only key prevents unauthorized data modifications  
✓ **Automatic Authentication**: Supabase handles auth tokens and session management  
✓ **Type-Safe Queries**: Clear error handling prevents silent failures  
✓ **Reusable Code**: Centralized API functions promote DRY principles

---

## Important Security Notes

⚠️ **API Key Safety**: The anon key is safe for client-side code only when protected by Row Level Security policies in Supabase  
⚠️ **Never Commit Service Keys**: Keep service role keys in environment variables, never in code

---

**Next Step:** [Setting up Storage Buckets](./08-settingup-storage-buckets.md)
