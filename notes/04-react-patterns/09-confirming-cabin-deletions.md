# Confirming Cabin Deletions

This note documents a small, reusable pattern for confirming destructive actions (deleting a cabin). It shows how to open a confirmation modal from multiple triggers and how the `ConfirmDelete` component behaves.

The examples below keep the original code logic intact and add concise comments and explanations to make the flow easy to revisit later.

---

## When to use

- When the user performs a destructive action (delete/remove) and you want to require explicit confirmation.
- When you need a shared confirmation UI that can be reused across resources (cabins, bookings, users).

---

## Usage example (modal triggers + windows)

This example shows a `Modal` wrapper with open triggers and modal windows. There are two modals in the snippet: one for editing and one for confirming deletions.

```jsx
<Modal>
  <Modal.Open opens="edits">
    <button>
      <HiPencil />
    </button>
  </Modal.Open>
  <Modal.Window name="edits ">
    <CreateCabinForm cabinToEdit={cabin} />
  </Modal.Window>

  <Modal.Open>
    <button disabled={isDeleting}>
      <HiTrash />
    </button>
  </Modal.Open>
  <Modal.Window>
    <ConfirmDelete
      resourceName="cabins"
      disabled={isDeleting}
      onConfirm={() => deletingCabin(id)}
    />
  </Modal.Window>
</Modal>
```

How it works

- `Modal.Open` defines the trigger button that opens a modal. The optional `opens` prop targets a specific `Modal.Window` by name.
- `Modal.Window` is the modal container. When its `name` matches the `openName` from the modal context, it renders the corresponding content.
- In this example the `ConfirmDelete` component is rendered inside a `Modal.Window` and receives `onConfirm` to call the actual deletion.

---

## Component example — `ConfirmDelete` (annotated)

The `ConfirmDelete` component is a simple presentational component that receives `resourceName`, `onConfirm`, `disabled`, and `onClose`. It confirms the user's intent before calling the provided `onConfirm`.

```jsx
function ConfirmDelete({ resourceName, onConfirm, disabled, onClose }) {
  return (
    <StyledConfirmDelete>
      <Heading as="h3">Delete {resourceName}</Heading>
      <p>
        Are you sure you want to delete this {resourceName} permanently? This
        action cannot be undone.
      </p>

      <div>
        {/* Cancel closes the modal using the injected `onClose` callback */}
        <Button variation="secondary" disabled={disabled} onClick={onClose}>
          Cancel
        </Button>
        {/* Confirm triggers the deletion flow provided by the parent */}
        <Button variation="danger" disabled={disabled} onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </StyledConfirmDelete>
  );
}
```

How it works

- `resourceName`: Used to make the message generic (e.g., "cabins", "bookings").
- `onConfirm`: Called when the user confirms; this should perform the deletion (API call or mutation).
- `disabled`: Prevents multiple submissions or actions while a deletion is in progress.
- `onClose`: Closes the modal without performing the action (injected by the modal wrapper via `cloneElement` or context).

---

## End-to-end flow

1. The user clicks the trash (`HiTrash`) button.
2. `Modal.Open` toggles the modal context to show the `Modal.Window` that contains `ConfirmDelete`.
3. `ConfirmDelete` displays the message and two buttons: Cancel and Delete.
   - Cancel calls `onClose` to close the modal with no side effects.
   - Delete calls `onConfirm` supplied by the parent. `onConfirm` should:
     - set a loading state (e.g., `isDeleting = true`)
     - call the API or mutation to delete the item
     - on success, close the modal and update local cache/state (e.g., refetch or remove item)
     - on failure, show an error and reset `isDeleting`
4. The modal unmounts and UI updates to reflect deletion.

---

## Important notes & benefits

- Reusability: `ConfirmDelete` is resource-agnostic — pass `resourceName` and handlers to reuse it.
- UX: Disabling the buttons while the operation is in progress prevents duplicate requests.
- Separation of concerns: `ConfirmDelete` only handles UI; the parent handles deletion logic and state.
- Accessibility: Consider focusing the modal when opened and supporting keyboard actions (`Esc` to cancel, `Enter` to confirm).

---

## Tips and best practices

- Provide clear, specific copy in the confirmation message when the action is irreversible.
- Visually distinguish the destructive action (red button) and place Cancel first for safety.
- Use optimistic updates or proper cache invalidation after deletion to keep UI in sync.
- Add analytics if you need to track deletions.

---

Next: [Building a reusable table](./10-building-a-reusable-table.md)
