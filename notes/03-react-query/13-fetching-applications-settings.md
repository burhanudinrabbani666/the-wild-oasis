# Fetching Application Settings

## Overview

Application settings are global configuration values (like booking limits and pricing) stored in a single database row. This guide shows how to fetch and display these settings.

---

## Prerequisites: Supabase Setup

**Configure Settings Table Policies:**

1. Supabase Dashboard → **Authentication → Policies** → `settings` table
2. Add **SELECT** and **UPDATE** policies for authenticated users

---

## Database Query Function

### Fetching the Settings Row

Settings are stored in a single row, so we use `.single()`.

```js
export async function getSettings() {
  const { data, error } = await supabase.from("settings").select("*").single(); // Returns object, not array

  if (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }

  return data;
}
```

**How It Works:**

- `.single()`: Returns `{ minBookingLength: 3, ... }` instead of `[{ ... }]`
- Without `.single()`: Would return an array with one object
- Expects exactly one row in the settings table

---

## Creating a Custom Hook

### Reusable Settings Query Hook

Extract the query logic into a custom hook for reusability.

```js
import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../../services/apiSettings";

export function useSettings() {
  const {
    isPending, // Loading state
    error, // Error object if query fails
    data: settings, // Renamed 'data' to 'settings' for clarity
  } = useQuery({
    queryKey: ["settings"], // Cache key for settings
    queryFn: getSettings, // Function to fetch settings
  });

  return { isPending, error, settings };
}
```

**Why a Custom Hook?**

- **Reusability**: Use in multiple components (UpdateSettingsForm, BookingForm, etc.)
- **Centralized Logic**: Query configuration in one place
- **Cleaner Components**: Import one hook instead of configuring useQuery everywhere
- **Consistency**: Same cache key used across the app

---

## Displaying Settings in a Form

### Pre-filling Form with Current Settings

Use the fetched settings as default values in form inputs.

```jsx
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Spinner from "../../ui/Spinner";
import { useSettings } from "./useSettings";

function UpdateSettingsForm() {
  // Fetch settings with custom hook
  const { isPending, settings = {} } = useSettings();

  // Destructure settings with fallback to empty object
  const {
    minBookingLength,
    maxBookingLength,
    maxGuestsPerBooking,
    breakfastPrice,
  } = settings;

  // Show spinner while loading
  if (isPending) return <Spinner />;

  return (
    <Form>
      <FormRow label="Minimum nights/booking">
        <Input
          type="number"
          id="min-nights"
          defaultValue={minBookingLength} // Pre-fill with current value
        />
      </FormRow>

      <FormRow label="Maximum nights/booking">
        <Input type="number" id="max-nights" defaultValue={maxBookingLength} />
      </FormRow>

      <FormRow label="Maximum guests/booking">
        <Input
          type="number"
          id="max-guests"
          defaultValue={maxGuestsPerBooking}
        />
      </FormRow>

      <FormRow label="Breakfast price">
        <Input
          type="number"
          id="breakfast-price"
          defaultValue={breakfastPrice}
          step="0.01" // Allow decimal values for price
        />
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
```

**Understanding the Component:**

- `settings = {}`: Empty object fallback prevents destructuring errors during loading
- `if (isPending) return <Spinner />`: Shows spinner while fetching
- `defaultValue`: Pre-fills inputs with current settings (uncontrolled inputs)
- `step="0.01"`: Allows decimal values for breakfast price

---

## Complete Fetch Flow

1. Component mounts → `useSettings()` executes
2. React Query calls `getSettings()` → queries Supabase
3. `.single()` returns settings object (not array)
4. Settings cached with key `["settings"]`
5. While loading: `isPending = true`, spinner shows
6. Data arrives → component re-renders with values
7. Inputs display current settings as defaults

---

## Key Benefits

✓ **Single Source of Truth**: One settings row controls app behavior  
✓ **Automatic Caching**: Settings fetched once, reused everywhere  
✓ **Custom Hook**: Easy to use in any component  
✓ **Loading State**: Prevents rendering with undefined values  
✓ **Type Safety**: Works well with TypeScript for settings structure

---

## Important Notes

⚠️ **Single Row**: Settings table should have exactly one row (use `.single()`)  
⚠️ **Empty Object Fallback**: `settings = {}` prevents destructuring errors during loading  
⚠️ **RLS Policies**: Ensure SELECT policy exists for authenticated users  
⚠️ **Default Values**: Use `defaultValue` for uncontrolled inputs, not `value`  
⚠️ **Cache Key**: Use `["settings"]` consistently across all settings queries

---

## Common Use Cases

**Booking Validation:** `nights >= settings.minBookingLength && nights <= settings.maxBookingLength`  
**Price Calculation:** `nightlyRate * nights + (hasBreakfast ? settings.breakfastPrice * guests : 0)`  
**Form Constraints:** `<Input min={settings.minBookingLength} max={settings.maxBookingLength} />`

---

**Next Step:** [Updating Application Settings](./14-updating-application-settings.md)
