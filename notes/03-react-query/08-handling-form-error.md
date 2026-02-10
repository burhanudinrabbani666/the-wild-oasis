# Form Validation and Error Handling

## Overview

React Hook Form provides built-in validation with automatic error handling. This guide shows how to validate fields and display error messages to users.

---

## Accessing Form Errors

### Extracting Error State from useForm

The `formState` object contains all form validation errors.

```jsx
import { useForm } from "react-hook-form";

function CreateCabinForm() {
  // Destructure formState to access errors
  const { register, handleSubmit, reset, getValues, formState } = useForm();
  const { errors } = formState;

  // errors object structure:
  // {
  //   name: { message: "This field is required", type: "required" },
  //   maxCapacity: { message: "Must be at least 1", type: "min" }
  // }
}
```

**Understanding formState:**

- `errors`: Object containing validation errors for each field
- Each error has a `message` (custom error text) and `type` (validation rule that failed)
- Errors are automatically populated when validation fails
- Cleared automatically when user fixes the input

---

## Creating a Reusable FormRow Component

### Building a Flexible Form Layout Component

This component handles labels and error display in a consistent way.

```jsx
import styled from "styled-components";

const StyledFormRow = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 24rem 1fr 1.2fr;
  gap: 2.4rem;
  padding: 1.2rem 0;
`;

const Label = styled.label`
  font-weight: 500;
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

function FormRow({ label, error, children }) {
  return <StyledFormRow>{error && <Error>{error}</Error>}</StyledFormRow>;
}

export default FormRow;
```

**How It Works:**

- Accepts `label`, `error`, and `children` as props
- `children` is the input element (Input, Textarea, Select, etc.)
- `children.props.id`: Accesses the id prop from the child input element
- Conditionally renders label and error based on whether they exist
- Error message displays in red when validation fails

## **Why This Pattern?**

## Adding Validation Rules

### Implementing Field Validation

React Hook Form validates fields based on rules you provide in the `register()` function.

```jsx
function CreateCabinForm() {
  const { register, handleSubmit, reset, formState, getValues } = useForm();
  const { errors } = formState;

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {/* Required field */}
      <FormRow label="Cabin name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          {...register("name", { required: "This field is required" })}
        />
      </FormRow>

      {/* Min/max validation */}
      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          {...register("maxCapacity", {
            required: "This field is required",
            min: { value: 1, message: "Capacity should be at least 1" },
          })}
        />
      </FormRow>

      {/* Custom validation (cross-field) */}
      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          {...register("discount", {
            required: "This field is required",
            validate: (value) =>
              value <= getValues().regularPrice ||
              "Discount should be less than regular price",
          })}
        />
      </FormRow>

      <FormRow>
        <Button variation="secondary" type="reset">
          Cancel
        </Button>
        <Button>Create cabin</Button>
      </FormRow>
    </Form>
  );
}
```

**Common Validation Rules:**

| Rule        | Example                                                  |
| ----------- | -------------------------------------------------------- |
| `required`  | `required: "This field is required"`                     |
| `min`       | `min: { value: 1, message: "At least 1" }`               |
| `max`       | `max: { value: 100, message: "Max 100" }`                |
| `minLength` | `minLength: { value: 3, message: "Min 3 chars" }`        |
| `pattern`   | `pattern: { value: /regex/, message: "Invalid" }`        |
| `validate`  | `validate: (value) => value > 0 \|\| "Must be positive"` |

---

## Complete Validation Flow

1. **User Fills Form**: User enters data into form fields
2. **User Submits**: User clicks submit button
3. **Validation Triggers**: React Hook Form validates all fields with rules
4. **Validation Fails**:
   - `handleSubmit` prevents form submission
   - `errors` object is populated with error messages
   - Components re-render to show error messages in red
   - Form remains filled with user's data
5. **User Fixes Errors**: As user corrects fields, errors clear automatically
6. **Validation Passes**:
   - All fields meet their validation rules
   - `errors` object is empty
   - `onSubmit` function is called with form data
   - Mutation proceeds as normal

---

## Key Benefits

✓ **Real-time Feedback**: Errors appear instantly when validation fails  
✓ **Automatic Clearing**: Errors disappear when user fixes the field  
✓ **Custom Messages**: Define user-friendly error messages for each rule  
✓ **No Extra State**: React Hook Form manages error state automatically  
✓ **Type Safety**: TypeScript support for validation rules and error messages  
✓ **Accessibility**: Error messages are associated with their inputs

---

## Important Notes

⚠️ **Optional Chaining**: Use `errors?.name?.message` to safely access nested properties  
⚠️ **Custom Validation**: Use `validate` for complex rules like comparing fields  
⚠️ **getValues()**: Access other field values - example: `value <= getValues().regularPrice`  
⚠️ **Error Timing**: Errors show after submission attempt or when field is touched  
⚠️ **Styling**: Make error messages visually distinct (red color, clear typography)

---

**Next Step:** [Uploading Images to Supabase](./09-uploading-images-to-supabase.md)
