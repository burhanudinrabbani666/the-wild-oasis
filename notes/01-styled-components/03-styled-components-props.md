# Styled Components with Props

## What are Props in Styled Components?

Props allow you to create dynamic, conditional styling based on the values passed to your styled components. This makes components highly reusable and adaptable without creating multiple similar components.

---

## Basic Concept

Styled components can access props through a function inside template literals, enabling conditional styling based on those props.

**Syntax:**

```js
const Component = styled.element`
  ${(props) =>
    props.condition &&
    css`
      /* styles when condition is true */
    `}
`;
```

---

## Import Requirements

```js
import styled, { css } from "styled-components";
```

**Important:** Import `css` helper for better syntax highlighting and performance when writing conditional styles.

---

## Complete Example: Dynamic Heading Component

### `/components/Heading.jsx`

```jsx
import styled, { css } from "styled-components";

const Heading = styled.h1`
  /* Base styles for all headings */
  line-height: 1.4;

  /* Conditional styles based on 'as' prop */
  ${(props) =>
    props.as === "h1" &&
    css`
      font-size: 3rem;
      font-weight: 600;
    `}

  ${(props) =>
    props.as === "h2" &&
    css`
      font-size: 2rem;
      font-weight: 600;
    `}

  ${(props) =>
    props.as === "h3" &&
    css`
      font-size: 2rem;
      font-weight: 500;
    `}
`;

export default Heading;
```

---

## How It Works

### Understanding the Flow

1. **Props Access**
   - Inside template literals, use `${(props) => ...}` to access component props
   - Props are the same props you pass in JSX

2. **Conditional Rendering**
   - Use JavaScript conditions (`===`, `&&`, ternary operators)
   - Return CSS only when condition is true

3. **CSS Helper**
   - Wrap your CSS in `css` helper for proper parsing
   - Provides better syntax highlighting and editor support

4. **The `as` Prop**
   - Special styled-components prop that changes the rendered HTML element
   - Maintains styles while changing semantic HTML tag

---

## Usage Examples

```jsx
import Heading from "./components/Heading";

function App() {
  return (
    <div>
      {/* Renders as <h1> with h1 styles */}
      <Heading as="h1">The Wild Oasis</Heading>

      {/* Renders as <h2> with h2 styles */}
      <Heading as="h2">Check in and out</Heading>

      {/* Renders as <h3> with h3 styles */}
      <Heading as="h3">Guest Details</Heading>
    </div>
  );
}
```

---

## Benefits of the `as` Prop

### ✅ Semantic HTML

- Maintains proper HTML structure and accessibility
- Different heading levels (h1, h2, h3) for SEO and screen readers

### ✅ Style Reusability

- One component with multiple variations
- No need to create `H1`, `H2`, `H3` separately

### ✅ Consistent Design

- All headings follow the same design system
- Easy to update styles in one place

---

## Alternative Syntax Patterns

### Pattern 1: Ternary Operator

```jsx
const Button = styled.button`
  background-color: ${(props) => props.primary ? "blue" : "gray"};
  color: ${(props) => props.primary ? "white" : "black"};
`;

// Usage
<Button primary>Primary Button</Button>
<Button>Secondary Button</Button>
```

## Complete Flow Explanation

```
1. Define styled component with props function
   ↓
2. Access props inside template literals using ${(props) => ...}
   ↓
3. Write conditional logic (===, &&, ternary)
   ↓
4. Return css`` helper with styles when condition is true
   ↓
5. Pass props in JSX like regular React props
   ↓
6. Use 'as' prop to change HTML element while keeping styles
   ↓
7. Component renders with dynamic styles based on props
```

---

## Key Points to Remember

- 🔥 **Import css:** Always import `css` helper from styled-components
- 🔥 **Arrow Function:** Use `${(props) => ...}` syntax inside template literals
- 🔥 **css Helper:** Wrap conditional styles in `css` for better performance
- 🔥 **as Prop:** Special prop that changes the rendered HTML element
- 🔥 **JavaScript Logic:** You can use any JavaScript expression inside `${}`
- 🔥 **Type Safety:** Props are fully accessible - use them for any dynamic styling

---

## Common Mistakes to Avoid

```jsx
// ❌ Wrong - Missing css helper
${(props) => props.large && `
  font-size: 2rem;
`}

// ✅ Correct - Using css helper
${(props) => props.large && css`
  font-size: 2rem;
`}

// ❌ Wrong - Not returning anything when false
${(props) => props.primary && css`...` || css`...`}

// ✅ Correct - Let it return undefined when false
${(props) => props.primary && css`...`}
${(props) => !props.primary && css`...`}
```

---

**Next:** [Building More Reusable Styled Components](./04-building-more-reusable-styled-components.md)
