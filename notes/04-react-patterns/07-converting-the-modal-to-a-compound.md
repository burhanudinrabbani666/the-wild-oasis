# Converting Modal to Compound Component Pattern

## Overview

Transform the basic modal into a flexible compound component that can manage multiple modals and their triggers declaratively. This pattern provides a clean API and eliminates the need for manual state management.

---

## The Problem with Basic Modal

```jsx
// ❌ Before: Manual state for each modal
const [showForm, setShowForm] = useState(false);
<button onClick={() => setShowForm(true)}>Add</button>;
{
  showForm && <Modal onClose={() => setShowForm(false)}>...</Modal>;
}

// ✅ After: Declarative compound component
<Modal>
  <Modal.Open opens="form">
    <Button>Add</Button>
  </Modal.Open>
  <Modal.Window name="form">
    <CreateCabinForm />
  </Modal.Window>
</Modal>;
```

---

## Building the Compound Modal

### Step 1: Context and Parent

```jsx
import { createContext, useContext, useState, cloneElement } from "react";
import { createPortal } from "react-dom";

const ModalContext = createContext();

function Modal({ children }) {
  const [openName, setOpenName] = useState("");
  const close = () => setOpenName("");
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}
```

`openName` tracks which modal is open, `close/open` modify it.

---

### Step 2: Open Component (Trigger)

```jsx
function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext);
  return cloneElement(children, { onClick: () => open(opensWindowName) });
}
```

`cloneElement` adds `onClick` to trigger button. Example: `<Button>` becomes `<Button onClick={() => open("form")}>`.

### Step 3: Window Component (Modal Content)

```jsx
function Window({ children, name }) {
  const { openName, close } = useContext(ModalContext);
  if (name !== openName) return null; // Only render if name matches

  return createPortal(
    <Overlay>
      <StyledModal>
        <Button onClick={close}>
          <HiXMark />
        </Button>
        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </StyledModal>
    </Overlay>,
    document.body,
  );
}
```

Only renders when `name === openName`. Passes `onCloseModal` to child via `cloneElement`.

---

### Step 4: Attach to Parent

```jsx
Modal.Open = Open;
Modal.Window = Window;

export default Modal;
```

---

## Using the Compound Modal

```jsx
function AddCabin() {
  return (
    <Modal>
      {/* Single modal */}
      <Modal.Open opens="cabin-form">
        <Button>Add New Cabin</Button>
      </Modal.Open>
      <Modal.Window name="cabin-form">
        <CreateCabinForm />
      </Modal.Window>

      {/* Multiple modals - same parent */}
      <Modal.Open opens="table">
        <Button>Show Table</Button>
      </Modal.Open>
      <Modal.Window name="table">
        <CabinTable />
      </Modal.Window>
    </Modal>
  );
}
```

**Flow:** Click button → `open("cabin-form")` → `openName = "cabin-form"` → Window with `name="cabin-form"` renders.

### Using onCloseModal in Children

```jsx
function CreateCabinForm({ onCloseModal }) {
  const { mutate } = useMutation({
    mutationFn: createCabin,
    onSuccess: () => {
      toast.success("Created");
      onCloseModal(); // Close modal after success
    },
  });
  return <form>...</form>;
}
```

---

## Complete Flow

1. Click button → `open("cabin-form")` → `openName = "cabin-form"`
2. All Windows check `name === openName` → matching Window renders
3. Portal created → child receives `onCloseModal` prop
4. Child calls `onCloseModal()` or user clicks X → `openName = ""` → modal disappears

---

## Key Benefits

✓ **No Manual State**: Context handles all state management  
✓ **Declarative API**: Clear what opens what  
✓ **Multiple Modals**: One parent manages many modals  
✓ **Flexible Triggers**: Any component can be a trigger  
✓ **Reusable Pattern**: Drop-in solution for modal needs

---

## Important Notes

⚠️ **cloneElement Required**: Injects onClick and onCloseModal props  
⚠️ **Unique Names**: Each modal needs unique `opens`/`name` pair  
⚠️ **Single Child**: `Open` and `Window` expect single child element  
⚠️ **Prop Naming**: Child receives `onCloseModal`, not `onClose`

---

## Understanding cloneElement

```jsx
cloneElement(<Button>Click</Button>, { onClick: handleClick });
// Result: <Button onClick={handleClick}>Click</Button>
```

**Use cases:** Add props to children, inject handlers, enhance wrapped components.

---

**Next Step:** [Detecting Click Outside Modal](./08-detecting-click-outside-modal.md)
