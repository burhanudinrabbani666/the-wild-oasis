# Client-side sorting

1. Using select and option element

```jsx
function SortBy({ options }) {
  const [searchParams, setSetSearchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy") || "";

  function handleChange(event) {
    searchParams.set("sortBy", event.target.value);
    setSetSearchParams(searchParams);
  }

  return (
    <Select
      options={options}
      type="white"
      onChange={handleChange}
      value={sortBy}
    ></Select>
  );
}

export default SortBy;
```

2. And Sorting after filtering

```jsx
function CabinTable() {
  const { isPending, cabins } = useCabin();
  const [searchParams] = useSearchParams();

  if (isPending) return <Spinner />;

  // Filtering cabins
  const filterValue = searchParams.get("discount") || "all";
  let filteredCabins;

  if (filterValue === "all") filteredCabins = cabins;
  if (filterValue === "no-discount")
    filteredCabins = cabins.filter((cabin) => cabin.discount === 0);
  if (filterValue === "with-discount")
    filteredCabins = cabins.filter((cabin) => cabin.discount > 0);

  // Sort
  const sortBy = searchParams.get("sortBy") || "startDate-asc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  const sortCabins = filteredCabins.sort(
    (a, b) => (a[field] - b[field]) * modifier,
  );

  return (
  )
  }
```

Next: [Building Bookings](./03-building-bookings.md)
