# React Hook Form: Simplified Form Management

## Overview

React Hook Form is a performant, flexible library for handling forms in React with minimal re-renders and easy validation.

📚 **Official Documentation**: [react-hook-form.com](https://react-hook-form.com/)

---

## Installation

### Adding React Hook Form to Your Project

```bash
npm install react-hook-form
```

**What You're Installing:**

- Lightweight form library with excellent performance
- Built-in validation support
- Minimal re-renders (uncontrolled components approach)
- Easy integration with UI libraries
- TypeScript support out of the box

---

## Basic Implementation

### Creating a Form with useForm Hook

React Hook Form uses the `useForm` hook to manage form state and submission.

```jsx
import { useForm } from "react-hook-form";

function CreateCabinForm() {
  // Initialize the form hook
  const { register, handleSubmit } = useForm();

  // Function called when form is submitted successfully
  function onSubmit(data) {
    console.log(data); // data contains all form field values as an object
    // Example output: { name: "Cabin 001", maxCapacity: 4, regularPrice: 300 }
  }

  return (
    // handleSubmit wraps your onSubmit function and handles validation
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow>
        <Label htmlFor="name">Cabin name</Label>
        {/* register() connects the input to React Hook Form */}
        <Input
          type="text"
          id="name"
          {...register("name")} // Spreads registration props (onChange, onBlur, ref, name)
        />
      </FormRow>

      <FormRow>
        <Label htmlFor="maxCapacity">Maximum capacity</Label>
        <Input type="number" id="maxCapacity" {...register("maxCapacity")} />
      </FormRow>

      <FormRow>
        <Label htmlFor="regularPrice">Regular price</Label>
        <Input type="number" id="regularPrice" {...register("regularPrice")} />
      </FormRow>

      <FormRow>
        <Button variation="secondary" type="reset">
          Cancel
        </Button>
        <Button type="submit">Create cabin</Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
```

**How It Works:**

- `useForm()`: Initializes form management with methods and state
- `register("fieldName")`: Registers an input field with the form
- `handleSubmit(onSubmit)`: Wraps your submit function, handles validation and prevents default form submission
- `{...register("name")}`: Spreads necessary props (onChange, onBlur, ref, name) onto the input
- Form data is automatically collected when submitted

**What `register()` Does:**

1. Connects the input to React Hook Form
2. Adds `onChange` handler to track value changes
3. Adds `onBlur` handler for validation triggers
4. Sets the `name` attribute for form data collection
5. Provides a `ref` for direct DOM access

---

## Understanding Form Submission

### The handleSubmit Flow

```jsx
<Form onSubmit={handleSubmit(onSubmit)}>
```

**Step-by-Step Process:**

1. User fills out form fields
2. User clicks submit button (type="submit")
3. `handleSubmit` intercepts the submit event
4. Validates all registered fields (if validation rules exist)
5. If valid: calls your `onSubmit` function with form data
6. If invalid: prevents submission and shows errors

**Data Structure:**

```js
// When onSubmit is called, data looks like:
{
  name: "Cabin 001",
  maxCapacity: 4,
  regularPrice: 300,
  discount: 50
}
```

---

## Key Benefits

✓ **Performance**: Minimal re-renders (only re-renders when necessary)  
✓ **Less Code**: No need for individual `useState` for each field  
✓ **Built-in Validation**: Easy field validation without external libraries  
✓ **Uncontrolled Components**: Uses refs instead of state for better performance  
✓ **Easy Integration**: Works with any UI component library  
✓ **TypeScript Support**: Full type safety for forms and validation

---

## Why React Hook Form?

**Traditional Approach:** Multiple `useState` hooks, manual `onChange` handlers, verbose code  
**React Hook Form:** Single `useForm` hook, automatic data collection, minimal re-renders

---

## Important Notes

⚠️ **Field Names**: The string in `register("name")` should match the `id` attribute for accessibility  
⚠️ **Submit Button**: Must have `type="submit"` to trigger form submission  
⚠️ **Form Tag**: Use a `<form>` element, not a div, for proper HTML semantics  
⚠️ **Default Values**: Use `defaultValues` in `useForm()` for pre-filled forms (covered in editing functionality)

---

## Common useForm Methods

| Method         | Purpose                  | Example                             |
| -------------- | ------------------------ | ----------------------------------- |
| `register`     | Connect input to form    | `{...register("name")}`             |
| `handleSubmit` | Handle form submission   | `onSubmit={handleSubmit(onSubmit)}` |
| `formState`    | Access form state/errors | `const { errors } = formState;`     |
| `reset`        | Reset form to defaults   | `reset()`                           |
| `watch`        | Watch field values       | `const name = watch("name")`        |

---

**Next Step:** [Creating a Cabin](./07-creating-cabin.md)
