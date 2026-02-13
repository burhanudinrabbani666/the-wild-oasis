# Client-Side Filtering

## Overview

Client-side filtering allows users to filter data through the URL using query parameters. This approach keeps the filter state persistent and shareable—when you filter and copy the URL, the filter settings are preserved.

## How It Works

The filtering system has two main components:

1. **Filter Component** - Updates the URL with filter selections
2. **Display Component** - Reads the URL and applies the filter logic

---

## Part 1: Filter Component (Setting URL Parameters)

### Purpose

This component displays filter buttons and updates the URL when a user clicks a filter option.

```jsx
function Filter({ filterField, options }) {
  // Read current filter value from URL, default to first option
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilter = searchParams.get(filterField) || options[0].value;

  // Update URL with selected filter value
  function handleClick(value) {
    searchParams.set(filterField, value);
    setSearchParams(searchParams); // Triggers URL update
  }

  return (
    <StyledFilter>
      {/* Render a button for each filter option */}
      {options.map((option) => (
        <FilterButton
          key={option.value}
          onClick={() => handleClick(option.value)}
          active={option.value === currentFilter} // Highlight active filter
        >
          {option.label}
        </FilterButton>
      ))}
    </StyledFilter>
  );
}
```

### Key Points

- **`searchParams.get(filterField)`** - Retrieves the current filter value from the URL
- **`searchParams.set()`** - Updates the filter value in URL parameters
- **`setSearchParams()`** - Applies the URL changes globally
- The `active` prop highlights which filter is currently selected

---

## Part 2: Display Component (Reading URL Parameters)

### Purpose

This component reads the filter value from the URL and applies filtering logic to display the appropriate data.

```jsx
function CabinTable() {
  const { isPending, cabins } = useCabin();

  // Read filter value from URL (default to "all")
  const [searchParams] = useSearchParams();
  const filterValue = searchParams.get("discount") || "all";

  if (isPending) return <Spinner />;

  // Apply filtering based on URL parameter
  let filteredCabins;
  if (filterValue === "all") filteredCabins = cabins;
  if (filterValue === "no-discount")
    filteredCabins = cabins.filter((cabin) => cabin.discount === 0);
  if (filterValue === "with-discount")
    filteredCabins = cabins.filter((cabin) => cabin.discount > 0);

  return (
    <Menus>
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
        <Table.Header>
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>
        {/* Render only filtered cabins */}
        {filteredCabins.map((cabin) => (
          <CabinRow cabin={cabin} key={cabin.id} />
        ))}
      </Table>
    </Menus>
  );
}

export default CabinTable;
```

---

## Complete Data Flow

1. User clicks a filter button → **Filter component** calls `handleClick()`
2. `searchParams.set()` updates the URL parameter
3. `setSearchParams()` triggers a global state update
4. URL changes (e.g., `?discount=no-discount`)
5. **CabinTable component** re-renders and reads the new URL parameter
6. Filtering logic filters cabins based on the URL value
7. Table displays only matching cabins

---

## Key Benefits

✅ **Persistent state** - Filter selection survives page refreshes  
✅ **Shareable URLs** - Users can copy filtered URLs and share them  
✅ **Browser history** - Back/forward buttons navigate between filter states  
✅ **SEO friendly** - Filter state is visible in the URL

---

## Next Steps

Read about [Client-side sorting](./02-client-side-sorting.md) to add sorting capabilities to your filtered data.
