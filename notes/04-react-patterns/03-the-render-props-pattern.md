# The Render Props Pattern

## Overview

The render props pattern is a React technique for sharing code between components using a prop whose value is a function. It allows components to be flexible and reusable without knowing what they're rendering.

---

## The Problem It Solves

```jsx
// ❌ Without: Separate components for each type
<ProductList products={products} />
<CompanyList companies={companies} />

// ✅ With render props: One component for all
<List items={products} render={(product) => <ProductItem product={product} />} />
<List items={companies} render={(company) => <CompanyItem company={company} />} />
```

---

## Creating a Reusable List Component

### Component with Render Props

```jsx
import { useState } from "react";

function List({ title, items, render }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Show only first 3 items when collapsed
  const displayItems = isCollapsed ? items.slice(0, 3) : items;

  function toggleOpen() {
    setIsOpen((isOpen) => !isOpen);
    setIsCollapsed(false); // Reset collapse when closing/opening
  }

  return (
    <div className="list-container">
      <div className="heading">
        <h2>{title}</h2>
        <button onClick={toggleOpen}>
          {isOpen ? <span>&or;</span> : <span>&and;</span>}
        </button>
      </div>

      {/* Call render function for each item */}
      {isOpen && <ul className="list">{displayItems.map(render)}</ul>}

      <button onClick={() => setIsCollapsed((isCollapsed) => !isCollapsed)}>
        {isCollapsed ? `Show all ${items.length}` : "Show less"}
      </button>
    </div>
  );
}

export default List;
```

**How It Works:**

- `render` prop: A function that tells the List how to render each item
- `displayItems.map(render)`: Calls render function for each item
- `render` receives the item as an argument and returns JSX
- List handles UI logic (open/collapse), render handles item display

**Key Concept:**  
The List component controls the **structure** and **behavior**, while the parent component controls the **content**.

---

## Using the List Component

### Example: Multiple Lists with Different Content

```jsx
const products = [
  { productName: "Laptop", price: 999 },
  { productName: "Phone", price: 599 },
];

const companies = [
  { name: "Apple", ticker: "AAPL" },
  { name: "Microsoft", ticker: "MSFT" },
];

export default function App() {
  return (
    <div>
      <h1>Render Props Demo</h1>
      <div className="col-2">
        <List
          title="Products"
          items={products}
          render={(product) => (
            <ProductItem key={product.productName} product={product} />
          )}
        />
        <List
          title="Companies"
          items={companies}
          render={(company) => (
            <CompanyItem key={company.name} company={company} />
          )}
        />
      </div>
    </div>
  );
}
```

**Understanding:** `render` function receives each item, returns JSX. `key` prop essential for lists.

---

## Complete Pattern Flow

1. Parent defines render function → specifies how to render each item
2. List receives items and render → gets data array and render function
3. List handles UI logic → open/close, show more/less functionality
4. `items.map(render)` → calls render function for each item
5. Render function returns JSX → item displayed in list structure

---

## Example Item Components

```jsx
function ProductItem({ product }) {
  return (
    <li>
      <strong>{product.productName}</strong> - ${product.price}
    </li>
  );
}

function CompanyItem({ company, defaultVisibility = true }) {
  const [isVisible, setIsVisible] = useState(defaultVisibility);
  return (
    <li>
      <strong>{company.name}</strong>
      <button onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? "Hide" : "Show"}
      </button>
      {isVisible && <span>{company.ticker}</span>}
    </li>
  );
}
```

---

## Key Benefits

✓ **Reusability**: One List component works with any data type  
✓ **Flexibility**: Parent controls content, List controls structure  
✓ **Separation of Concerns**: UI logic separate from content rendering  
✓ **Composition**: Build complex UIs from simple components  
✓ **Type Safety**: Works well with TypeScript generics

---

## Alternative: Children as Function

Use children instead of render prop:

```jsx
function List({ title, items, children }) {
  return <ul>{displayItems.map(children)}</ul>;
}

// Usage
<List title="Products" items={products}>
  {(product) => <ProductItem product={product} />}
</List>;
```

---

## When to Use Render Props

**✅ Use:** Component handles logic/UI but not content, need different renders of same structure  
**❌ Don't use:** Simple props sufficient, always same content, performance critical

---

## Important Notes

⚠️ **Key Prop**: Always provide `key` when rendering lists  
⚠️ **Function Naming**: `render` is convention, can be any name (renderItem, children)  
⚠️ **Performance**: Consider `useCallback` for complex render functions  
⚠️ **Pattern vs Hooks**: Modern React often uses custom hooks instead

---

**Next Step:** [Higher-Order Components](./04-a-look-higher-components.md)
