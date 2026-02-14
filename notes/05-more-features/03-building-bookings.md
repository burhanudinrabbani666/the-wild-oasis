# Building bookings

1. fetch data from supabase

```js
export async function getBookings() {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*, cabins(name), guests(fullName, email)");

    if (error) {
      console.log(error);
      throw new Error("Bookings could not be loaded");
    }

    return { data };
  } catch (error) {
    toast(error.message);
  }
}
```

in select function, the code also get data relation. that just take some properti from cabins(get by cbainsid) and guests( get by guestsid)

2. crete Custom hooks

```js
import { useQuery } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";

export function useBookings() {
  const {
    data,
    isPending: bookingsLoading,
    error: bookingsError,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: getBookings,
  });

  return { data, bookingsLoading, bookingsError };
}
```

3. implement to components

```jsx
const { data, bookingsLoading } = useBookings();

if (bookingsLoading) return <Spinner />;

const bookings = data.data;
if (!bookings.length) return <Empty resource={"bookings"} />;
```

Next: [Uploading sample data](./04-uploading-sample-data.md)
