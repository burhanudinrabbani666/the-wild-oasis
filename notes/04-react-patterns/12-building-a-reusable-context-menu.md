# Building a Reusable Context Menu

This note documents a compound component pattern for creating a flexible, reusable context menu (right-click style menu). The pattern uses React Context to share menu state (open/closed, position) across sub-components, allowing the menu button, list, and items to communicate without prop drilling.

---

## When to use

- When you need a dropdown menu that appears near a trigger button (e.g., action buttons in table rows).
- When menu state (open/closed, position) must be shared across multiple child components.
- When you want a reusable menu component that works in different contexts (tables, lists, etc.).

---

## Overview — before using compound components

Without this pattern, you'd manually manage menu state and positioning in every location, resulting in repeated logic and tight coupling.

With compound components + context, a single `<Menus>` wrapper provides all necessary state to `Toggle`, `List`, and `Button` sub-components, keeping code DRY and declarative.

---

## Implementation — complete code

### Context Setup

```jsx
import { useState, createContext, useContext } from "react";
import styled from "styled-components";
import { createPortal } from "react-dom";
import { useOutsideClick } from "./useOutsideClick";

// Context holds all menu state dispatched across sub-components
const MenusContext = createContext();

// ============================================================================
// Main Menus Component — Provider
// ============================================================================

function Menus({ children }) {
  // openId tracks which menu is currently open (by menu id)
  const [openId, setOpenId] = useState("");

  // position stores the computed x, y coordinates for portal rendering
  const [position, setPosition] = useState(null);

  // Helper: close all menus
  const close = () => setOpenId("");

  // Helper: open a menu by id
  const open = setOpenId;

  return (
    <MenusContext.Provider
      value={{ openId, close, open, position, setPosition }}
    >
      {children}
    </MenusContext.Provider>
  );
}

// ============================================================================
// Styled Components
// ============================================================================

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  cursor: pointer;
  border-radius: 3px;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }
`;

const StyledList = styled.ul`
  position: fixed;
  z-index: 1000;
  top: ${(props) => props.position?.y}px;
  right: ${(props) => props.position?.x}px;

  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: 5px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  list-style: none;
  margin: 0;
  padding: 0.8rem 0;
  min-width: 160px;
`;

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  width: 100%;
  background: none;
  border: none;
  padding: 0.8rem 1.6rem;
  cursor: pointer;
  font-size: 1.4rem;
  color: var(--color-grey-700);
  transition:
    background-color 0.2s,
    color 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
    color: var(--color-grey-900);
  }
`;

// ============================================================================
// Sub-Components — Compound Exports
// ============================================================================

function Toggle({ id }) {
  // Consume context to access menu state and setters
  const { openId, close, open, setPosition } = useContext(MenusContext);

  function handleClick(event) {
    // Get the bounding rect of the toggle button
    const { x, y, width, height } = event.target
      .closest("button")
      .getBoundingClientRect();

    // Compute position for the menu list (top-right corner below button)
    // x is from left; we need right positioning, so calculate as (viewport - left - button width)
    // y is positioned below the button with 8px spacing
    setPosition({
      x: window.innerWidth - width - x,
      y: y + height + 8,
    });

    // Toggle: if menu is closed or a different menu is open, open this one; otherwise close it
    openId === "" || openId !== id ? open(id) : close();
  }

  return (
    <StyledToggle onClick={handleClick}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}

function List({ id, children }) {
  // Consume context to get open state and position
  const { openId, position, close } = useContext(MenusContext);

  // useOutsideClick hook closes the menu when user clicks outside the list
  const ref = useOutsideClick(close);

  // Only render this menu if its id matches the currently open menu
  if (openId !== id) return null;

  // Render the menu list into document.body via portal to avoid overflow clipping
  return createPortal(
    <StyledList ref={ref} position={position}>
      {children}
    </StyledList>,
    document.body,
  );
}

function Button({ children, onClick, icon }) {
  // Consume close action from context
  const { close } = useContext(MenusContext);

  function handleClick() {
    // Call the action provided by parent
    onClick?.();

    // Always close the menu after action is taken
    close();
  }

  return (
    <li>
      <StyledButton onClick={handleClick}>
        {icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  );
}

// ============================================================================
// Attach Sub-Components — Compound Pattern
// ============================================================================

Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
```

---

## How it works — end-to-end

1. **Provider initialization**: `<Menus>` creates a context with `openId`, `position`, and methods `open()` and `close()`.

2. **Toggle click**: When user clicks `Menus.Toggle`, `handleClick` computes the button's bounding rect and calculates the menu position relative to the viewport. It then calls `open(id)` to set `openId`.

3. **List rendering**: `Menus.List` consumes the context. If `openId === id` (this menu is open), it renders the list content via `createPortal` at the calculated position.

4. **Outside click**: The `useOutsideClick` hook detects when the user clicks outside the menu and calls `close()`, which resets `openId` and hides the menu.

5. **Button action**: When a `Menus.Button` is clicked, it executes the provided `onClick` callback (e.g., duplicate, edit, delete) and then calls `close()` to close the menu.

---

## Usage example — in a table row

```jsx
function CabinRow({ cabin }) {
  const { id, name, maxCapacity, regulerPrice, discount, image, description } =
    cabin;

  // Hooks for data mutations
  const { createCabin } = useCreateCabin();
  const { isDeleting, deletingCabin } = useDeleteCabin();

  function handleDuplicate() {
    createCabin({
      name: `Copy of ${name}`,
      maxCapacity,
      regulerPrice,
      discount,
      description,
      image,
    });
  }

  return (
    <Table.Row>
      <Img src={image} />
      <Cabin>{name}</Cabin>
      <div>Fits up to {maxCapacity} guest</div>
      <Price>{formatCurrency(regulerPrice)}</Price>
      {discount ? (
        <Discount>{formatCurrency(discount)}</Discount>
      ) : (
        <span>&mdash;</span>
      )}
      <div>
        {/* Menus wrapper provides context to all children */}
        <Menus>
          {/* Toggle button that opens the menu */}
          <Menus.Toggle id={id} />

          {/* Menu list that appears when toggle is clicked */}
          <Menus.List id={id}>
            {/* Duplicate action */}
            <Menus.Button icon={<HiSquare2Stack />} onClick={handleDuplicate}>
              Duplicate
            </Menus.Button>

            {/* Edit action — wrapped in Modal.Open for modal integration */}
            <Modal.Open opens="edit">
              <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
            </Modal.Open>

            {/* Delete action — wrapped in Modal.Open for confirmation modal */}
            <Modal.Open opens="delete">
              <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
            </Modal.Open>
          </Menus.List>

          {/* Modal content for editing */}
          <Modal.Window name="edit">
            <CreateCabinForm cabinToEdit={cabin} />
          </Modal.Window>

          {/* Modal content for deletion confirmation */}
          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName="cabins"
              disabled={isDeleting}
              onConfirm={() => deletingCabin(id)}
            />
          </Modal.Window>
        </Menus>
      </div>
    </Table.Row>
  );
}

export default CabinRow;
```

---

## How the example works

1. **Each row has a menu**: Every `CabinRow` wraps its action menu in `<Menus>`, providing state isolation per row.

2. **Toggle opens the menu**: Clicking the ellipsis button calls `Toggle`, which opens the menu with computed positioning.

3. **Menu list renders conditionally**: `Menus.List` only renders if `openId === id` (this menu's id).

4. **Actions with modals**:
   - **Duplicate**: Direct call to `handleDuplicate`, then closes menu.
   - **Edit**: Wrapped in `Modal.Open`, opens modal on click, then closes menu.
   - **Delete**: Wrapped in `Modal.Open`, opens confirmation modal, then closes menu.

5. **Outside click closes**: Clicking outside the menu (detected by `useOutsideClick`) closes it automatically.

---

## Flow diagram (textual)

```
User clicks Toggle button
  ↓
handleClick computes button position
  ↓
open(id) sets openId in context
  ↓
List component re-renders (openId === id, so it renders)
  ↓
createPortal renders menu at computed position
  ↓
User clicks a Button or clicks outside
  ↓
onClick callback fires (if action button) + close() called
  ↓
openId resets to ""
  ↓
List component re-renders (openId !== id, so it returns null)
  ↓
Menu disappears
```

---

## Key benefits

- **State centralization**: All menu state lives in one place (`openId`, `position`), avoiding prop drilling.
- **Reusability**: Use the same `Menus` component in tables, lists, cards, anywhere you need a context menu.
- **Portal rendering**: Menu renders at the top level (document.body) to avoid overflow clipping.
- **Outside click detection**: `useOutsideClick` provides seamless close-on-click-outside UX.
- **Modal integration**: Menu buttons can wrap `Modal.Open` for seamless modal/menu workflows.
- **Position calculation**: Automatic right-aligned positioning keeps menus visible even near screen edges.

---

## Important notes

- **Unique IDs**: Each menu toggle needs a unique `id` so the context knows which menu to render.
- **Position calculation**: The `setPosition` logic positions the menu to the right of the button and below it. For edge cases (near screen edge), consider adding boundary detection.
- **Portal cleanup**: React automatically cleans up portals when the component unmounts.
- **Context errors**: If a sub-component is used outside `<Menus>`, it will throw "Cannot read properties of undefined" as `useContext` returns `undefined`. Guard with a custom hook or add error handling.
- **Accessibility**: Consider adding keyboard support (`ArrowUp`/`ArrowDown` to navigate items, `Enter` to select, `Esc` to close).

---

## Tips and best practices

- **Custom hook**: Create a `useMenusContext()` hook to access the context, enabling better error handling:

  ```jsx
  function useMenusContext() {
    const context = useContext(MenusContext);
    if (!context)
      throw new Error("useMenusContext must be used within <Menus>");
    return context;
  }
  ```

- **Keyboard navigation**: Add arrow key handling to navigate menu items and `Esc` to close.

- **Accessibility attributes**: Add `aria-expanded`, `aria-haspopup="true"` to the toggle button and `role="menuitem"` to menu items.

- **Performance**: For tables with many rows, consider virtualizing rows to reduce DOM nodes and re-renders.

- **Screen edge detection**: Detect if menu extends past the right/bottom edge and reposition as needed:

  ```jsx
  const adjustedX =
    window.innerWidth - width - x < 160 ? x : window.innerWidth - width - x;
  ```

---

## Common integration patterns

### With a table

```jsx
<Table columns="...">
  <Table.Header>...</Table.Header>
  <Table.Body>
    {items.map((item) => (
      <Menus key={item.id}>
        <Table.Row>
          {/* row content */}
          <Menus.Toggle id={item.id} />
          <Menus.List id={item.id}>
            <Menus.Button onClick={...}>Action</Menus.Button>
          </Menus.List>
        </Table.Row>
      </Menus>
    ))}
  </Table.Body>
</Table>
```

### With modals

```jsx
<Menus>
  <Menus.Toggle id="..." />
  <Menus.List id="...">
    <Modal.Open opens="edit">
      <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
    </Modal.Open>
    <Modal.Window name="edit">
      <EditForm />
    </Modal.Window>
  </Menus.List>
</Menus>
```

---

Next: [Section 5 - More features](../05-more-features/)
