# Global Styles with Styled Components

## What are Global Styles?

Global styles are CSS rules that apply to your entire application (like CSS resets, typography, or base styles). Styled Components provides `createGlobalStyle` to define these global styles while keeping them in your JavaScript files.

---

## Installation & Import

```js
import { createGlobalStyle } from "styled-components";
```

**Note:** You need to import `createGlobalStyle` separately from the main `styled` import.

---

## Creating Global Styles

### File Structure

Create a dedicated file for global styles:

```
src/
├── styles/
│   └── GlobalStyles.js
├── components/
│   ├── Button.jsx
│   └── Input.jsx
└── App.jsx
```

### `/styles/GlobalStyles.js`

```js
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  ...CSS here
`;

export default GlobalStyles;
```

---

## How It Works

### Understanding createGlobalStyle

1. **Creates a Special Component**
   - `createGlobalStyle` returns a React component (not a styled element)
   - This component injects global CSS when rendered

2. **No Children Allowed**
   - GlobalStyles component should be self-closing
   - It doesn't wrap other components (used as a sibling)

3. **Placement Matters**
   - Render it at the root level (usually in `App.jsx`)
   - Place it as a sibling to your main app content

---

## Implementation in App Component

### `App.jsx`

```jsx
import GlobalStyles from "./styles/GlobalStyles";
function App() {
  return (
    <>
      {/* GlobalStyles component - self-closing, no children */}
      <GlobalStyles />

      {/* Main app content - sibling to GlobalStyles */}
      <StyledApp>
        <H1>The Wild Oasis</H1>
        <Button onClick={() => alert("Check in")}>Check in</Button>
        <Button onClick={() => alert("Check out")}>Check out</Button>
        <Input type="number" placeholder="Number of guests" />
      </StyledApp>
    </>
  );
}

export default App;
```

---

## Organizing Components into Separate Files

### Best Practice: Component File Structure

Moving reusable styled components into their own files improves organization and reusability.

### `/components/Button.jsx`

```jsx
import styled from "styled-components";

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

export default Button;
```

### `/components/Input.jsx`

```jsx
import styled from "styled-components";

const Input = styled.input`
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 0.8rem 1.2rem;
`;

export default Input;
```

### Updated `App.jsx` with Imports

```jsx
import styled from "styled-components";
import GlobalStyles from "./styles/GlobalStyles";
import Button from "./components/Button";
import Input from "./components/Input";

const StyledApp = styled.div`
  background-color: orangered;
  padding: 20px;
`;

const H1 = styled.h1`
  font-size: 30px;
  font-weight: 600;
  background-color: green;
`;

function App() {
  return (
    <>
      <GlobalStyles />
      <StyledApp>
        <H1>The Wild Oasis</H1>
        <Button onClick={() => alert("Check in")}>Check in</Button>
        <Button onClick={() => alert("Check out")}>Check out</Button>
        <Input type="number" placeholder="Number of guests" />
      </StyledApp>
    </>
  );
}

export default App;
```

---

## Complete Flow Explanation

```
1. Create GlobalStyles.js using createGlobalStyle
   ↓
2. Define global CSS rules (resets, typography, etc.)
   ↓
3. Export GlobalStyles component
   ↓
4. Import GlobalStyles in App.jsx
   ↓
5. Render <GlobalStyles /> as sibling (inside fragment <>)
   ↓
6. Global styles are injected into <head> and applied app-wide
   ↓
7. Organize reusable styled components into separate files
   ↓
8. Import and use them across your application
```

---

## Key Points to Remember

- 🔥 **Self-Closing Component:** `<GlobalStyles />` not `<GlobalStyles>...</GlobalStyles>`
- 🔥 **Sibling Placement:** Use fragments `<>` to render GlobalStyles alongside your app
- 🔥 **No Props Needed:** GlobalStyles typically doesn't receive props
- 🔥 **File Organization:** Keep global styles in `/styles` and reusable components in `/components`
- 🔥 **Import Separately:** `createGlobalStyle` is a named export, not default

---

**Next:** [Styled Components Props](./03-styled-components-props.md)
