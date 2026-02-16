# Prefetching with react query

Prefetching is fetching data that we know to use it latter. or fetch next before rendering

```js
// Query
const {
  data: { data: bookings, count } = {},
  isPending: bookingsLoading,
  error: bookingsError,
} = useQuery({
  queryKey: ["bookings", filter, sortBy, page],
  queryFn: () => getBookings({ filter, sortBy, page }),
});

// Prefetching
const pageCount = Math.ceil(count / PAGE_SIZE);

if (page < pageCount)
  queryClient.prefetchQuery({
    queryKey: ["bookings", filter, sortBy, page + 1],
    queryFn: () => getBookings({ filter, sortBy, page: page + 1 }),
  });

if (page > 1)
  queryClient.prefetchQuery({
    queryKey: ["bookings", filter, sortBy, page - 1],
    queryFn: () => getBookings({ filter, sortBy, page: page - 1 }),
  });
```

Next: [Building the single booking page](./10-building-the-single-booking-page.md)
