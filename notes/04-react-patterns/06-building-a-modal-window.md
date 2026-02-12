# Building a Modal Window with React Portal

## Overview

A modal is a dialog overlay that appears on top of the main content. Using React's `createPortal`, we can render the modal at the top level of the DOM tree, ensuring it's never hidden by other elements' CSS.

---

## The Problem: CSS Stacking Context

```jsx
// ❌ Without Portal: Modal can get clipped by parent overflow/z-index
<div style={{ overflow: 'hidden' }}><Modal /></div>

// ✅ With Portal: Modal rendered at document.body, always on top
<div style={{ overflow: 'hidden' }}><Modal /></div> {/* Not affected */}
```

Portals bypass normal DOM hierarchy, ensuring modals always render at top level.

---

## Basic Modal Implementation

### Simple Modal Component

```jsx
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 8px;
  padding: 3.2rem 4rem;
  max-width: 60rem;
`;

const Button = styled.button`
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;
  background: none;
  border: none;
  cursor: pointer;
`;

function Modal({ children, onClose }) {
  // Render modal at document.body, bypassing normal DOM hierarchy
  return createPortal(
    <Overlay>
      <StyledModal>
        <Button onClick={onClose}>
          <HiXMark />
        </Button>
        <div>{children}</div>
      </StyledModal>
    </Overlay>,
    document.body, // Where to render in the DOM
  );
}

export default Modal;
```

**How createPortal Works:**

- First arg: JSX to render | Second arg: DOM node (`document.body`)
- Modal appears at end of `<body>` | Still receives props from parent

---

## Using the Modal

### Basic Usage with State

```jsx
import { useState } from "react";
import Modal from "./Modal";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <h2>Modal Title</h2>
          <p>Modal content goes here</p>
        </Modal>
      )}
    </div>
  );
}
```

---

## Enhanced Features

### Click Outside to Close

```jsx
<Overlay onClick={onClose}>
  {" "}
  {/* Click backdrop closes */}
  <StyledModal onClick={(e) => e.stopPropagation()}>
    {" "}
    {/* Click modal doesn't close */}
    <Button onClick={onClose}>
      <HiXMark />
    </Button>
    {children}
  </StyledModal>
</Overlay>
```

`stopPropagation()` prevents click event from bubbling to Overlay.

### Escape Key to Close

```jsx
useEffect(() => {
  const handleEscape = (e) => e.key === "Escape" && onClose();
  document.addEventListener("keydown", handleEscape);
  return () => document.removeEventListener("keydown", handleEscape);
}, [onClose]);
```

---

## Key Benefits

✓ **No CSS Issues**: Modal never gets clipped or hidden  
✓ **Always on Top**: Renders at document.body level  
✓ **Event Handling**: Still works with React events and state  
✓ **Accessibility**: Can add focus management easily  
✓ **Clean Markup**: Keeps component tree organized

---

## Important Notes

⚠️ **Portal Location**: Always render to `document.body` for modals  
⚠️ **Event Bubbling**: Events bubble through React tree, not DOM tree  
⚠️ **Cleanup**: Remove event listeners in useEffect cleanup  
⚠️ **Accessibility**: Add `role="dialog"` and `aria-modal="true"` for screen readers  
⚠️ **Body Scroll**: Consider disabling body scroll when modal is open

---

## Accessibility Improvements

```jsx
useEffect(() => {
  document.body.style.overflow = "hidden"; // Disable body scroll
  return () => {
    document.body.style.overflow = "unset";
  };
}, []);

// Add to StyledModal
<StyledModal
  role="dialog"
  aria-modal="true"
  onClick={(e) => e.stopPropagation()}
>
  <Button onClick={onClose} aria-label="Close modal">
    <HiXMark />
  </Button>
  {children}
</StyledModal>;
```

---

## Common Use Cases

**Form Modal:**

```jsx
<Modal onClose={closeModal}>
  <CreateUserForm onSubmit={handleSubmit} />
</Modal>
```

**Confirmation Dialog:**

```jsx
<Modal onClose={closeModal}>
  <h2>Delete Item?</h2>
  <p>This action cannot be undone.</p>
  <button onClick={handleDelete}>Delete</button>
  <button onClick={closeModal}>Cancel</button>
</Modal>
```

---

**Next Step:** [Converting to Compound Component Pattern](./07-modal-compound-component.md)
