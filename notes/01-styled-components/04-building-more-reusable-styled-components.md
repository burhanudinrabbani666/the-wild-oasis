# Building More Reusable Styled Components

## Overview

Creating truly reusable components means designing them to handle multiple use cases through props. This approach reduces code duplication and creates a consistent design system across your application.

---

## Key Concepts

### 1. Prop-Based Variations

Define multiple style variations that can be selected via props

### 2. Configuration Objects

Store style variations in JavaScript objects for cleaner code

### 3. Dynamic Style Selection

Use props to select the appropriate styles from configuration objects

---

## Example 1: Reusable Row Component

### `/components/Row.jsx`

```jsx
import styled, { css } from "styled-components";

const Row = styled.div`
  display: flex;

  /* Horizontal layout - items in a row */
  ${(props) =>
    props.type === "horizontal" &&
    css`
      justify-content: space-between;
      align-items: center;
    `}

  /* Vertical layout - items stacked */
  ${(props) =>
    props.type === "vertical" &&
    css`
      flex-direction: column;
      gap: 1.6rem;
    `}
`;

export default Row;
```

### How It Works

1. **Base Styles:** `display: flex` applies to all Row components
2. **Conditional Styles:** Different layouts based on `type` prop
3. **Prop Selection:** Pass `type="horizontal"` or `type="vertical"` to change layout

### Usage Example

```jsx
{
  /* Horizontal Row - items side by side */
}
<Row inputProp="horizontal">
  <Heading as="h1">The Wild Oasis</Heading>
  <Button>Click me</Button>
</Row>;

{
  /* Vertical Row - items stacked */
}
<Row inputProp="vertical">
  <Heading as="h3">Form</Heading>
  <Input placeholder="Enter text" />
</Row>;
```

---

## Example 2: Advanced Button with Multiple Variations

### `/components/Button.jsx`

```jsx
import styled, { css } from "styled-components";

// Configuration object for size variations
const sizes = {
  small: css`
    font-size: 1.2rem;
    padding: 0.4rem 0.8rem;
    text-transform: uppercase;
    font-weight: 600;
    text-align: center;
  `,
  medium: css`
    font-size: 1.4rem;
    padding: 1.2rem 1.6rem;
    font-weight: 500;
  `,
  large: css`
    font-size: 1.6rem;
    padding: 1.2rem 2.4rem;
    font-weight: 500;
  `,
};

// Configuration object for color/style variations
const variations = {
  primary: css`
    color: var(--color-brand-50);
    background-color: var(--color-brand-600);

    &:hover {
      background-color: var(--color-brand-700);
    }
  `,
  secondary: css`
    color: var(--color-grey-600);
    background: var(--color-grey-0);
    border: 1px solid var(--color-grey-200);

    &:hover {
      background-color: var(--color-grey-50);
    }
  `,
  danger: css`
    color: var(--color-red-100);
    background-color: var(--color-red-700);

    &:hover {
      background-color: var(--color-red-800);
    }
  `,
};

// Styled button with dynamic styles
const Button = styled.button`
  /* Base styles - always applied */
  border: none;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  cursor: pointer;

  /* Dynamic size styles - selected by props.size */
  ${(props) => sizes[props.size]}

  /* Dynamic variation styles - selected by props.variation */
  ${(props) => variations[props.variation]}
`;

// Set default props
Button.defaultProps = {
  variation: "primary",
  size: "medium",
};

export default Button;
```

### How It Works

1. **Configuration Objects:** `sizes` and `variations` store all possible style combinations
2. **Object Bracket Notation:** `sizes[props.size]` selects the correct style set
3. **CSS Helper:** Each configuration value uses `css` helper for proper styling
4. **Default Props:** Fallback values if props aren't provided

### Usage Examples

```jsx
{
  /* Primary button - medium size (defaults) */
}
<Button onClick={() => alert("Check in")}>Check in</Button>;

{
  /* Secondary button - small size */
}
<Button variation="secondary" size="small" onClick={() => alert("Check out")}>
  Check out
</Button>;

{
  /* Danger button - large size */
}
<Button variation="danger" size="large" onClick={() => handleDelete()}>
  Delete Account
</Button>;
```

---

## Complete Application Example

### `App.jsx`

```jsx
import GlobalStyles from "./styles/GlobalStyles";
import styled from "styled-components";
import Row from "./components/Row";
import Heading from "./components/Heading";
import Button from "./components/Button";
import Input from "./components/Input";

const StyledApp = styled.div`
  background-color: var(--color-grey-50);
  padding: 20px;
`;

function App() {
  return (
    <>
      {/* Global styles component */}
      <GlobalStyles />

      <StyledApp>
        {/* Main vertical container */}
        <Row inputProp="vertical">
          {/* Header section - horizontal layout */}
          <Row inputProp="horizontal">
            <Heading as="h1">The Wild Oasis</Heading>

            <div>
              <Heading as="h2">Check in and out</Heading>

              {/* Primary medium button */}
              <Button
                variation="primary"
                size="medium"
                onClick={() => alert("Check in")}
              >
                Check in
              </Button>

              {/* Secondary small button */}
              <Button
                variation="secondary"
                size="small"
                onClick={() => alert("Check out")}
              >
                Check out
              </Button>
            </div>
          </Row>

          {/* Form section - vertical layout */}
          <Row inputProp="vertical">
            <Heading as="h3">Form</Heading>
            <form>
              <Input type="number" placeholder="Number of guests" />
              <Input type="number" placeholder="Number of nights" />
            </form>
          </Row>
        </Row>
      </StyledApp>
    </>
  );
}

export default App;
```

---

## Understanding Configuration Objects Pattern

### Why Use Configuration Objects?

✅ **Cleaner Code:** Separates style definitions from component logic  
✅ **Easy to Extend:** Add new variations by adding to the object  
✅ **Type Safety:** Clear set of available options  
✅ **Maintainability:** Update all variations in one place

### Pattern Breakdown

```jsx
// Step 1: Define configuration object
const sizes = {
  small: css`
    /* styles */
  `,
  medium: css`
    /* styles */
  `,
  large: css`
    /* styles */
  `,
};

// Step 2: Use bracket notation to select
const Component = styled.div`
  ${(props) => sizes[props.size]}
`;

// Step 3: Pass prop to select variation
<Component size="small" />;
```

---

## Advanced Patterns

### Combining Multiple Props

```jsx
const Button = styled.button`
  /* Base styles */
  border: none;
  cursor: pointer;

  /* Apply size */
  ${(props) => sizes[props.size]}

  /* Apply variation */
  ${(props) => variations[props.variation]}
  
  /* Apply state */
  ${(props) =>
    props.disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
    `}
`;
```

### Default Props

```jsx
// Method 1: Using defaultProps
Button.defaultProps = {
  variation: "primary",
  size: "medium",
};

// Method 2: Using OR operator
${(props) => sizes[props.size || "medium"]}
```

---

## Complete Flow Explanation

```
1. Create configuration objects (sizes, variations, etc.)
   ↓
2. Store style sets using css helper
   ↓
3. Define styled component with base styles
   ↓
4. Use ${(props) => object[props.key]} to select styles
   ↓
5. Set default props (optional)
   ↓
6. Pass props in JSX to select variations
   ↓
7. Component renders with combined base + dynamic styles
```

---

## Best Practices

### ✅ Do

- Use descriptive prop names (`variation`, `size`, `type`)
- Store related variations in configuration objects
- Provide sensible default props
- Keep base styles separate from variations
- Use CSS variables for colors and spacing

### ❌ Don't

- Hardcode all variations inline
- Create separate components for each variation
- Use unclear prop names (`mode`, `kind`, `style`)
- Forget to export configuration objects if reused elsewhere

---

## Key Points to Remember

- 🔥 **Configuration Objects:** Store style variations in objects for cleaner code
- 🔥 **Bracket Notation:** `object[props.key]` selects the right variation
- 🔥 **css Helper:** Always wrap style blocks in `css` helper
- 🔥 **Default Props:** Set defaults for better developer experience
- 🔥 **Composition:** Combine multiple prop-based variations
- 🔥 **Scalability:** Easy to add new variations without changing component structure

---

## Common Use Cases

```jsx
// Layout components
<Row inputProp="horizontal" gap="large" />
<Grid columns={3} />

// UI components
<Button variation="primary" size="large" />
<Badge color="success" />

// Form components
<Input variant="outlined" size="medium" />
<Select theme="dark" />
```

---

**Next:** [Setting Up Pages and Routes](./05-settings-up-pages-and-routes.md)
