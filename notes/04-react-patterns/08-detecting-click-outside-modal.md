# Detecting Click Outside Modal

This note explains a small, reusable pattern for closing a modal when the user clicks outside of it. It contains the modal wrapper (`Window`) that uses React Portal and a custom hook `useOutsideClick` that detects outside clicks.

Keep the code examples intact — comments were added to clarify purpose and behavior.

---

## When to use

- When you render a modal/dialog that must close if the user clicks anywhere outside the modal content.
- When you want a reusable hook that can be attached to any element to handle outside clicks.

---

## Example — Modal wrapper (`Window`)

```jsx
function Window({ children, name }) {
  const { openName, close } = useContext(ModalContext);
  // attach the returned ref to the modal element so the hook can detect outside clicks
  const ref = useOutsideClick(close);

  // only render this modal when its `name` matches the currently open modal
  if (name !== openName) return null;

  // createPortal renders the modal at the top level (document.body).
  // This avoids issues like clipping/overflow from parent stacking contexts
  // so the modal appears above other content and isn't cut off by parent styles.
  return createPortal(
    <Overlay>
      <StyledModal ref={ref}>
        <Button onClick={close}>
          <HiXMark />
        </Button>

        {/* cloneElement is used to inject an `onClose` prop into the modal children */}
        <div>{cloneElement(children, { onClose: close })}</div>
      </StyledModal>
    </Overlay>,
    document.body,
  );
}
```

Understanding

- `ModalContext` provides `openName` (which modal is open) and `close()` to close it.
- `useOutsideClick(close)` returns a `ref` that is attached to the modal element. The hook listens for document clicks and calls `close()` when a click occurs outside the referenced element.
- `createPortal(..., document.body)` ensures the modal is rendered at the top of the DOM hierarchy, preventing layout or overflow clipping from ancestor elements.

---

## Example — `useOutsideClick` hook

```js
import { useEffect, useRef } from "react";

export function useOutsideClick(handler, listenCapturing = true) {
  const ref = useRef();

  useEffect(() => {
    function handleClick(event) {
      // If `ref.current` exists and the click target is not contained inside it,
      // invoke the handler (i.e., close the modal).
      if (ref.current && !ref.current.contains(event.target)) {
        // Helpful logs for debugging — remove in production
        console.log(ref.current, event.target);
        console.log("click outside");
        handler();
      }
    }

    // `listenCapturing` controls whether we attach the listener in the capturing phase.
    // Using the capturing phase (true) can help ensure outside clicks are detected
    // before other handlers stop propagation in the bubble phase.
    document.addEventListener("click", handleClick, listenCapturing);

    return () =>
      document.removeEventListener("click", handleClick, listenCapturing);
  }, [handler, listenCapturing]);

  return ref;
}
```

Understanding

- The hook returns a `ref` object intended to be attached to the DOM node you want to consider "inside".
- When a click happens anywhere on the document, `handleClick` checks whether the click target is inside `ref.current`.
- If the click is outside, the provided `handler` is invoked.
- `listenCapturing` defaults to `true` here so the listener runs during the capturing phase. This can be useful to catch clicks even if other code calls `stopPropagation()` during bubbling. If you prefer standard behavior, set `listenCapturing` to `false`.

Notes about event options

- The third argument to `addEventListener` can be a boolean (legacy) or an options object (`{ capture: true }`). In modern code using options objects is clearer, e.g.:

  ```js
  document.addEventListener("click", handleClick, { capture: true });
  ```

  The current code passes a boolean for compatibility and brevity. Either approach works, but using the options object makes intent explicit.

---

## How it works — end-to-end

1. A modal controller (ModalContext) sets `openName` to the active modal and provides `close()`.
2. `Window` component is mounted for the named modal. It calls `useOutsideClick(close)` and attaches the returned `ref` to the modal DOM node (`StyledModal`).
3. The modal is rendered into `document.body` via `createPortal`, ensuring it floats above other layout elements.
4. When the user clicks anywhere, the document-level click listener executes.
   - If the click target is inside the modal (contained by `ref.current`), nothing happens.
   - If the click target is outside, the `handler` (`close`) is called and the modal closes.
5. The event listener is cleaned up automatically when the hook's effect is torn down.

Complete flow diagram (textual):

- User clicks -> Browser dispatches `click` event -> document listener (capturing/bubbling depending on option) -> `handleClick` runs -> checks `ref.current.contains(event.target)` -> calls `close()` when false -> `Window` unmounts

---

## Important notes & benefits

- Reusable: `useOutsideClick` can be attached to any element (dropdowns, tooltips, popovers), not just modals.
- Portal usage: `createPortal` prevents parent overflow or stacking context problems that can clip modals.
- Capturing vs Bubbling: Listening in the capturing phase helps detect outside clicks even if child components call `stopPropagation()` during bubbling. If you rely on bubbling, pass `false` for `listenCapturing`.
- Accessibility: Closing on outside click is convenient but consider also supporting `Esc` key and focusing trap for accessibility. Combine this pattern with keyboard handlers and focus management for full accessibility.

---

## Code maintenance tips

- Remove debug `console.log` statements before production.
- Consider using an options object for `addEventListener` (`{ capture: true }`) for clarity.
- If your app has multiple portals or shadow DOM, ensure the `ref` and event target logic still applies.

---

Next: [Confirming cabin deletions](./09-confirming-cabin-deletions.md)
