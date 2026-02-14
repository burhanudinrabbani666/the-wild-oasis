# Building Reusable Pagination

## Overview

Pagination splits large datasets into pages for better performance and UX. This component manages page state via URL parameters, making pages shareable and bookmarkable.

---

## The Pagination Component

### Complete Implementation

```jsx
import { useSearchParams } from "react-router-dom";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

const PAGE_SIZE = 10; // Number of items per page

function Pagination({ count }) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get current page from URL, default to 1
  const currentPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));

  // Calculate total number of pages
  const pageCount = Math.ceil(count / PAGE_SIZE);

  function nextPage() {
    // Don't go beyond last page
    const next = currentPage === pageCount ? currentPage : currentPage + 1;
    searchParams.set("page", next);
    setSearchParams(searchParams);
  }

  function prevPage() {
    // Don't go below page 1
    const prev = currentPage === 1 ? currentPage : currentPage - 1;
    searchParams.set("page", prev);
    setSearchParams(searchParams);
  }

  // Hide pagination if only 1 page or less
  if (pageCount <= 1) return null;

  return (
    <StyledPagination>
      <p>
        Showing <span>{(currentPage - 1) * PAGE_SIZE + 1}</span> to{" "}
        <span>
          {currentPage === pageCount ? count : currentPage * PAGE_SIZE}
        </span>{" "}
        of <span>{count}</span> results
      </p>

      <Buttons>
        <PaginationButton onClick={prevPage} disabled={currentPage === 1}>
          <HiChevronLeft /> <span>Previous</span>
        </PaginationButton>

        <PaginationButton
          onClick={nextPage}
          disabled={currentPage === pageCount}
        >
          <span>Next</span>
          <HiChevronRight />
        </PaginationButton>
      </Buttons>
    </StyledPagination>
  );
}

export default Pagination;
```

---

## Understanding the Logic

```jsx
const currentPage = !searchParams.get("page")
  ? 1
  : Number(searchParams.get("page"));
const pageCount = Math.ceil(count / PAGE_SIZE);
```

- Reads `?page=2` from URL, defaults to 1
- `Math.ceil(95 / 10) = 10 pages` (rounds up)

---

### Navigation Logic

```jsx
function nextPage() {
  const next = currentPage === pageCount ? currentPage : currentPage + 1;
  searchParams.set("page", next);
  setSearchParams(searchParams);
}
```

**How It Works:** If on last page, stay there. Otherwise increment. Updates URL to trigger re-fetch.

---

### Display Range Calculation

```jsx
(currentPage - 1) * PAGE_SIZE + 1; // Start of range
currentPage === pageCount ? count : currentPage * PAGE_SIZE; // End of range
```

**Examples:**

- Page 1: Shows "1 to 10"
- Page 2: Shows "11 to 20"
- Page 10 (last, 95 total): Shows "91 to 95" (uses `count` not `10 * 10`)

---

## Usage in Component

### Passing Total Count

```jsx
import Pagination from "./Pagination";

function BookingTable() {
  const { bookings, count } = useBookings();

  return (
    <div>
      <Table data={bookings} />
      <Pagination count={count} /> {/* Total number of records */}
    </div>
  );
}
```

**count prop:** Total number of records in database (e.g., 95 bookings)

---

## Complete Flow

1. **Component Mounts**: Reads URL, defaults to page 1
2. **Page Calculated**: `pageCount = Math.ceil(count / PAGE_SIZE)`
3. **User Clicks Next**: `nextPage()` called
4. **URL Updated**: `?page=2` added to URL
5. **Component Re-renders**: Detects page change
6. **Data Refetched**: API fetches page 2 data (handled separately)
7. **Display Updated**: Shows "Showing 11 to 20 of 95 results"

---

## Key Benefits

✓ **URL-Driven State**: Page number in URL, shareable and bookmarkable  
✓ **Reusable**: Works with any paginated data  
✓ **No External State**: Uses URL as source of truth  
✓ **Edge Case Handling**: Can't go below 1 or above last page  
✓ **Conditional Rendering**: Hides when only 1 page

---

## Important Notes

⚠️ **PAGE_SIZE Constant**: Exported or shared with API functions for consistency  
⚠️ **Count Prop**: Must be total records, not current page items  
⚠️ **Disabled Buttons**: Prevent navigation beyond valid pages  
⚠️ **Hidden When Unnecessary**: Returns null if only 1 page  
⚠️ **URL Sync**: Always use searchParams, not component state

---

## Styled Components Example

```jsx
const StyledPagination = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1.2rem;
`;

const PaginationButton = styled.button`
  background-color: ${(props) => (props.disabled ? "grey" : "blue")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 4px;

  &:hover:not(:disabled) {
    background-color: darkblue;
  }
`;
```

---

**Next Step:** [API-Side Pagination](./08-api-side-pagination.md)
