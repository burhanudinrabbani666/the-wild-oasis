# Building a Reusable Table

This note documents the transformation from a simple hardcoded table structure to a flexible, reusable `Table` compound component. The compound pattern allows cleaner, more declarative markup while keeping shared state and styling logic centralized.

---

## Before: Hardcoded markup

Without the compound component pattern, you'd pass column names and styling to individual components:

```jsx
<TableHeader role="row">
  <div></div>
  <div>Cabin</div>
  <div>Capacity</div>
  <div>Price</div>
  <div>Discount</div>
  <div></div>
</TableHeader>
```

Issues with this approach:

- Copy-pasting the column structure in every table.
- No single source of truth for column layout.
- Styling must be managed separately or duplicated.

---

## After: Compound component pattern

Using the compound component pattern, column configuration is centralized in the parent `Table` and shared via context:

```jsx
<Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 0.6fr">
  <Table.Header>
    <div></div>
    <div>Cabin</div>
    <div>Capacity</div>
    <div>Price</div>
    <div>Discount</div>
    <div></div>
  </Table.Header>

  <Table.Body>
    {cabins.map((cabin) => (
      <Table.Row key={cabin.id}>
        <div>{/* content */}</div>
        <div>{cabin.name}</div>
        <div>{cabin.maxCapacity}</div>
        <div>€ {cabin.regularPrice}</div>
        <div>{cabin.discount || "—"}</div>
        <div>{/* actions */}</div>
      </Table.Row>
    ))}
  </Table.Body>

  <Table.Footer>{/* optional footer content */}</Table.Footer>
</Table>
```

Benefits:

- Columns are defined once and applied to all rows automatically.
- Declarative and expressive syntax.
- Sub-components are self-contained and reusable.

---

## Implementation — Complete styled component code

```jsx
import { createContext, useContext } from "react";
import styled from "styled-components";

// ============================================================================
// Styled Components
// ============================================================================

const StyledTable = styled.div`
  border: 1px solid var(--color-grey-200);
  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  border-radius: 7px;
  overflow: hidden;
`;

// CommonRow is a base style shared by Header and Row
// The ${(props) => props.columns} receives the grid template from context
const CommonRow = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.columns};
  column-gap: 2.4rem;
  align-items: center;
  transition: none;
`;

// StyledHeader extends CommonRow with typography and spacing specific to table headers
const StyledHeader = styled(CommonRow)`
  padding: 1.6rem 2.4rem;
  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-600);
`;

// StyledRow extends CommonRow with row-specific spacing and borders
const StyledRow = styled(CommonRow)`
  padding: 1.2rem 2.4rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

// StyledBody wraps the table rows
const StyledBody = styled.section`
  margin: 0.4rem 0;
`;

// Footer with smart :has() selector hides itself if it contains no children
const Footer = styled.footer`
  background-color: var(--color-grey-50);
  display: flex;
  justify-content: center;
  padding: 1.2rem;

  /* Hidden if footer has no child elements (using CSS :has selector) */
  &:not(:has(*)) {
    display: none;
  }
`;

// Empty state message
const Empty = styled.p`
  font-size: 1.6rem;
  font-weight: 500;
  text-align: center;
  margin: 2.4rem;
`;

// ============================================================================
// Context
// ============================================================================

// TableContext holds the columns grid template so all sub-components use it
const TableContext = createContext();

// ============================================================================
// Compound Components
// ============================================================================

function Table({ columns, children }) {
  // Provide the columns grid string to all child components via context
  return (
    <TableContext.Provider value={{ columns }}>
      <StyledTable role="table">{children}</StyledTable>
    </TableContext.Provider>
  );
}

function Header({ children }) {
  // Consume columns from context and apply it to the header row
  const { columns } = useContext(TableContext);

  return (
    <StyledHeader role="row" columns={columns} as="header">
      {children}
    </StyledHeader>
  );
}

function Body({ children }) {
  // Body component wraps rows in StyledBody for grouping
  return <StyledBody role="rowgroup">{children}</StyledBody>;
}

function Row({ children }) {
  // Consume columns from context and apply it to each row
  const { columns } = useContext(TableContext);

  return (
    <StyledRow role="row" columns={columns}>
      {children}
    </StyledRow>
  );
}

// Attach sub-components to the Table
Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
Table.Footer = Footer;
Table.Empty = Empty;

export default Table;
```

---

## How it works

1. **Context initialization**: The parent `Table` component receives a `columns` prop (a CSS grid template string) and provides it via `TableContext`.

2. **Sub-component consumption**: `Table.Header`, `Table.Body`, and `Table.Row` consume the `columns` value from context using `useContext(TableContext)`.

3. **Grid application**: Each row (header or data) receives the `columns` prop and passes it to the styled component. The styled component uses it in the CSS: `grid-template-columns: ${(props) => props.columns}`.

4. **Compound attachment**: Sub-components are attached as properties to the `Table` function (`Table.Header = Header`, etc.), enabling the dot-notation usage in JSX.

5. **Footer behavior**: The `Footer` uses CSS `:not(:has(*))` to hide itself when empty, keeping markup clean.

---

## Complete usage example

```jsx
function CabinTable({ cabins, isLoading }) {
  // Assuming a mutation hook for deletion
  const { mutate: deleteCabin } = useMutation(apiDeleteCabin);

  if (isLoading) return <Spinner />;

  return (
    <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 0.6fr">
      {/* Header defines the column labels */}
      <Table.Header>
        <div></div>
        <div>Cabin</div>
        <div>Capacity</div>
        <div>Price</div>
        <div>Discount</div>
        <div></div>
      </Table.Header>
    </Table>
  );
}
```

---

## Key benefits

- **Single source of truth**: Column layout defined once in the parent `Table` component.
- **Flexibility**: Change columns for the entire table by updating a single prop.
- **Reusability**: The same `Table` component can be used for cabins, bookings, guests, etc.
- **Readability**: Compound syntax is expressive and self-documenting.
- **Maintainability**: Sub-components are isolated and easy to test.
- **Smart defaults**: The `:not(:has(*))` selector on Footer allows optional, auto-hiding footers.

---

## Important notes

- The `columns` prop should be a valid CSS Grid template string, e.g., `"1fr 2fr 1fr"` or `"0.6fr 1.8fr 2.2fr 1fr 1fr 0.6fr"`.
- Accessibility: Use semantic HTML (`role="table"`, `role="row"`, `role="rowgroup"`) for screen readers.
- Styled-component shorthand `as="header"` on `StyledHeader` overrides the default div element to render as a semantic `<header>`.
- For very large tables, consider virtualization (e.g., `react-window`) to improve performance.

---

## Tips

- Use consistent spacing values (2.4rem, 1.2rem, etc.) across components for visual harmony.
- Consider adding hover effects, selection states, or sorting indicators in the `Row` component.
- Extend the pattern to include `Table.Actions` or `Table.Cell` sub-components if needed.
- Test the responsive behavior: does the column layout break on smaller screens? Consider media queries or alternative layouts.

---

Next: [Applying the render props pattern](./11-applying-the-render-props-pattern.md)
