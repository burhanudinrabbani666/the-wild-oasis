# Higher-Order Components (HOC) Pattern

## Overview

A Higher-Order Component (HOC) is a function that takes a component and returns a new component with additional props or behavior. It's a pattern for reusing component logic.

> ⚠️ **Note:** This pattern is **not recommended** in modern React. Use custom hooks instead. This is included for understanding legacy code.

---

## The Pattern Explained

```jsx
// Basic HOC structure
function withSomething(Component) {
  return function EnhancedComponent(props) {
    // Add logic here
    return <Component {...props} />;
  };
}

// Usage
const EnhancedVersion = withSomething(OriginalComponent);
```

**Key:** HOC = Function that takes a component → Returns new component with extra functionality.

---

## Creating a Simple Component

### Basic List Component (Without HOC)

```jsx
function ProductList({ title, items }) {
  return (
    <ul className="list">
      {items.map((product) => (
        <ProductItem key={product.productName} product={product} />
      ))}
    </ul>
  );
}
```

**Problem:** This component has no toggle or collapse functionality. We could add it directly, but what if we want to reuse that logic?

---

## Creating a Higher-Order Component

### HOC that Adds Toggle Functionality

```jsx
export default function withToggles(WrappedComponent) {
  return function List(props) {
    // State for toggle functionality
    const [isOpen, setIsOpen] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Show only first 3 items when collapsed
    const displayItems = isCollapsed ? props.items.slice(0, 3) : props.items;

    function toggleOpen() {
      setIsOpen((isOpen) => !isOpen);
      setIsCollapsed(false); // Reset collapse when toggling
    }

    return (
      <div className="list-container">
        <div className="heading">
          <h2>{props.title}</h2>
          <button onClick={toggleOpen}>
            {isOpen ? <span>&or;</span> : <span>&and;</span>}
          </button>
        </div>

        {/* Render wrapped component with modified items */}
        {isOpen && <WrappedComponent {...props} items={displayItems} />}

        <button onClick={() => setIsCollapsed((isCollapsed) => !isCollapsed)}>
          {isCollapsed ? `Show all ${props.items.length}` : "Show less"}
        </button>
      </div>
    );
  };
}
```

**How It Works:**

1. `withToggles` receives a component (`WrappedComponent`)
2. Returns a new component that wraps the original
3. New component adds toggle/collapse state and UI
4. Passes all props to wrapped component with `{...props}`
5. Overrides `items` prop with `displayItems` (filtered array)

---

## Using the HOC

### Enhancing Components

```jsx
import ProductList from "./ProductList";
import withToggles from "./withToggles";

// Create enhanced version
const ProductListWithToggles = withToggles(ProductList);

// Usage
export default function App() {
  const products = [
    { productName: "Laptop", price: 999 },
    { productName: "Phone", price: 599 },
  ];

  return (
    <div className="col-2">
      <ProductList title="Products" items={products} />
      <ProductListWithToggles title="Products with Toggles" items={products} />
    </div>
  );
}
```

**Understanding:** `ProductList` is simple, `ProductListWithToggles` adds toggle features without changing original code.

---

## Complete HOC Flow

1. Define base component → Create HOC → Wrap component
2. `ProductListWithToggles = withToggles(ProductList)`
3. Render enhanced component → props flow through, `items` modified

---

## Key Benefits (Historical)

✓ **Reusable Logic**: Add functionality to any component  
✓ **Separation of Concerns**: Logic separate from rendering  
✓ **Composition**: Multiple HOCs can be chained

---

## Why NOT Recommended Anymore

❌ **Props Collision**: HOC might override props from parent  
❌ **Wrapper Hell**: Multiple HOCs create deep nesting in component tree  
❌ **Hard to Debug**: Complex component trees  
❌ **Static Composition**: Must compose before rendering

**Example:** `withAuth(withLogging(withToggles(Component)))` creates deep nesting.

---

## Modern Alternative: Custom Hooks

Instead of HOCs, use custom hooks (RECOMMENDED):

```jsx
function useToggles(items) {
  const [isOpen, setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const displayItems = isCollapsed ? items.slice(0, 3) : items;

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    setIsCollapsed(false);
  };

  return { isOpen, isCollapsed, displayItems, toggleOpen, setIsCollapsed };
}

// Usage: const { isOpen, displayItems, toggleOpen } = useToggles(items);
```

**Why Hooks are Better:** No wrapper components, clear data flow, easy to debug, flexible composition.

---

## When You Might See HOCs

**Legacy code examples:** `connect()` (Redux), `withRouter()` (React Router v5), `withStyles()` (Material-UI v4)  
**Modern equivalents:** `useSelector/useDispatch()`, `useNavigate/useParams()`, `styled()` or `sx` prop

---

## Important Notes

⚠️ **Legacy Pattern**: Understand it for reading old code, but use hooks for new code  
⚠️ **Props Spreading**: `{...props}` passes all props through to wrapped component  
⚠️ **Naming Convention**: HOCs typically start with "with" (withAuth, withData, etc.)  
⚠️ **Display Name**: Set `displayName` on HOCs for better debugging

---

**Next Step:** [The Compound Components Pattern](./05-the-compound-components-pattern.md)
