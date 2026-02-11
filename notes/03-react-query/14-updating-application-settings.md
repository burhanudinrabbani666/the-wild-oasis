# Updating Application Settings

## Overview

This guide shows how to update application settings instantly as users edit them, using the `onBlur` event for automatic saving without a submit button.

---

## Creating the Update Function

### API Function for Updating Settings

```js
export async function updateSetting(newSetting) {
  const { data, error } = await supabase
    .from("settings")
    .update(newSetting)
    .eq("id", 1) // Settings table has only one row
    .select();

  if (error) {
    console.error(error);
    throw new Error("Settings could not be updated");
  }

  return data;
}
```

**How It Works:** Updates the single settings row (id=1) with new values like `{ minBookingLength: 5 }`.

---

## Custom Hook for Update Mutation

### Reusable Settings Update Hook

```js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateSetting as updateSettingApi } from "../../services/apiSettings";

export function useUpdateSetting() {
  const queryClient = useQueryClient();

  const { mutate: updateSetting, isPending: isUpdating } = useMutation({
    mutationFn: updateSettingApi,
    onSuccess: () => {
      toast.success("Setting successfully updated");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (error) => toast.error(error.message),
  });

  return { updateSetting, isUpdating };
}
```

**Why a Custom Hook?**

- Reusable across all setting inputs
- Centralizes mutation logic
- Automatic cache invalidation
- Consistent error/success handling

---

## Implementing Auto-Save with onBlur

### The Update Handler Function

This function handles the automatic saving when users finish editing a field.

```jsx
import { useUpdateSetting } from "./useUpdateSetting";
import { useSettings } from "./useSettings";

function UpdateSettingsForm() {
  const { isPending, settings = {} } = useSettings();
  const { updateSetting, isUpdating } = useUpdateSetting();

  const {
    minBookingLength,
    maxBookingLength,
    maxGuestsPerBooking,
    breakfastPrice,
  } = settings;

  function handleUpdate(event, field) {
    const { value } = event.target;

    // Don't update if field is empty
    if (!value) return;

    // Update the specific field with the new value
    updateSetting({ [field]: Number(value) });
  }

  if (isPending) return <Spinner />;

  return (
    <Form>
      <FormRow label="Minimum nights/booking">
        <Input
          type="number"
          id="min-nights"
          defaultValue={minBookingLength}
          disabled={isUpdating}
          onBlur={(event) => handleUpdate(event, "minBookingLength")}
        />
      </FormRow>

      <FormRow label="Maximum nights/booking">
        <Input
          type="number"
          id="max-nights"
          defaultValue={maxBookingLength}
          disabled={isUpdating}
          onBlur={(event) => handleUpdate(event, "maxBookingLength")}
        />
      </FormRow>

      <FormRow label="Maximum guests/booking">
        <Input
          type="number"
          id="max-guests"
          defaultValue={maxGuestsPerBooking}
          disabled={isUpdating}
          onBlur={(event) => handleUpdate(event, "maxGuestsPerBooking")}
        />
      </FormRow>

      <FormRow label="Breakfast price">
        <Input
          type="number"
          id="breakfast-price"
          defaultValue={breakfastPrice}
          disabled={isUpdating}
          onBlur={(event) => handleUpdate(event, "breakfastPrice")}
          step="0.01"
        />
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
```

**Understanding the Implementation:**

- `onBlur`: Fires when user leaves input field (clicks away or tabs)
- `{ [field]: Number(value) }`: Computed property creates dynamic object key
- `if (!value) return`: Prevents updating with empty values
- `disabled={isUpdating}`: Prevents conflicting simultaneous updates

---

## Complete Update Flow

1. User edits input → leaves field (onBlur fires)
2. `handleUpdate()` extracts value and field name
3. Value converted to number: `Number(value)`
4. Mutation triggered: `updateSetting({ minBookingLength: 5 })`
5. Supabase updates settings row
6. Success toast → cache invalidated → settings refetched
7. All components using settings see new value

---

## Why onBlur Instead of onChange?

**onBlur** (when leaving field): Auto-save, reduces API calls  
**onChange** (every keystroke): Real-time validation, search

**Benefits:** Fewer API calls, better UX, reduces server load, prevents partial values.

---

## Key Benefits

✓ **No Submit Button**: Settings save automatically  
✓ **Instant Updates**: Changes reflected immediately across the app  
✓ **Field-Level Updates**: Only changed field is updated  
✓ **Optimistic UX**: Cache invalidation updates all components  
✓ **Error Handling**: Toast notifications for success/failure

---

## Important Notes

⚠️ **Number Conversion**: Always use `Number(value)` for numeric fields  
⚠️ **Empty Check**: `if (!value) return` prevents updating with empty strings  
⚠️ **Computed Property**: `{ [field]: value }` creates dynamic object keys  
⚠️ **Single Row**: Settings table must have exactly one row with `id = 1`  
⚠️ **Disable All Inputs**: Use `isUpdating` on all inputs to prevent race conditions

---

**Next Step:** [Section 4 - React Patterns](../04-react-patterns/)
