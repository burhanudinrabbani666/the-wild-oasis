# Introduction to 💅 Styled Components

## What is Styled Components?

Styled Components is a CSS-in-JS library that allows you to write CSS directly inside your JavaScript/React components. It enables you to create reusable, scoped styled components with the full power of CSS.

**Key Benefits:**

- ✅ Component-scoped styling (no CSS conflicts)
- ✅ Dynamic styling based on props
- ✅ Automatic vendor prefixing
- ✅ Eliminates unused CSS
- ✅ Easy maintenance and refactoring

---

## Installation

### 1. Install the Package

```bash
npm install styled-components
```

### 2. Install VS Code Extension (Recommended)

Install **vscode-styled-components** for syntax highlighting and IntelliSense support inside template literals.

---

## Basic Usage Example

```jsx
import styled from "styled-components";

// Creating a styled h1 component
const H1 = styled.h1`
  font-size: 30px;
  font-weight: 600;
  background-color: green;
`;

// Creating a styled button component with full CSS support
const Button = styled.button`
  font-size: 1.4rem;
  padding: 1.2rem 1.6rem;
  font-weight: 500;
  border: none;
  border-radius: 7px;
  background-color: purple;
  color: white;
  margin-right: 20px;
  cursor: pointer;
`;

// Creating a styled input component
const Input = styled.input`
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 0.8rem 1.2rem;
`;

// Creating a styled container (common pattern: StyledComponentName)
const StyledApp = styled.div`
  background-color: orangered;
  padding: 20px;
`;

function App() {
  return (
    <StyledApp>
      <H1>The Wild Oasis</H1>

      {/* Using styled components like regular React components */}
      <Button onClick={() => alert("Check in")}>Check in</Button>
      <Button onClick={() => alert("Check out")}>Check out</Button>

      <Input type="number" placeholder="Number of guests" />
    </StyledApp>
  );
}

export default App;
```

---

## How It Works

### Step-by-Step Flow

1. **Import styled-components**
   - Import the `styled` object from the library

2. **Create Styled Components**
   - Use `styled.elementName` followed by template literals (backticks)
   - Write regular CSS inside the backticks
   - Each styled component becomes a reusable React component

3. **Use in JSX**
   - Use your styled components like any other React component
   - They accept all standard HTML attributes and props

4. **Runtime Processing**
   - Styled Components generates unique class names automatically
   - Injects CSS into the document's `<head>`
   - Ensures styles are scoped to the component only

---

## Naming Conventions

**Best Practice:** Prefix container components with `Styled`

```jsx
// ✅ Good - Clear that it's a styled version of App's container
const StyledApp = styled.div``;

// ✅ Good - Descriptive component names
const PrimaryButton = styled.button``;
const PageHeader = styled.header``;

// ❌ Avoid - Too generic
const Container = styled.div``;
```

---

## Complete Example Flow

```
1. Install styled-components via npm
   ↓
2. Import styled from "styled-components"
   ↓
3. Create styled components using styled.element`` syntax
   ↓
4. Write CSS inside template literals (backticks)
   ↓
5. Use styled components in JSX like regular components
   ↓
6. Styled Components generates unique class names & injects CSS
```

---

## Important Notes

- 🔥 **Template Literals:** Always use backticks (\`) not quotes
- 🔥 **CSS Syntax:** Write standard CSS (properties, values, pseudo-classes all work)
- 🔥 **Component Naming:** Use PascalCase (same as React components)
- 🔥 **No Class Names:** You don't write or manage class names manually

---

**Next:** [Global styles with styled components](./02-global-styles-with-styled-components.md)
