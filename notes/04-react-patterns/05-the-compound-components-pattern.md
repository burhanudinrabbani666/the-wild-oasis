# The Compound Components Pattern

## Overview

The Compound Components pattern is one of the **most useful and popular React patterns**. It allows you to create flexible, reusable components where parent and child components work together through shared state.

**Think of it like HTML elements:** `<select>` and `<option>` work together, or `<table>`, `<thead>`, `<tbody>`, and `<tr>` form a cohesive unit.

---

## The Problem It Solves

```jsx
// ❌ Inflexible - fixed structure, many props
<Counter label="Counter" showLabel showIncrease increaseIcon="+" />

// ✅ Flexible - compose as needed
<Counter>
  <Counter.Label>My Counter</Counter.Label>
  <Counter.Increase icon="+" />
  <Counter.Count />
</Counter>
```

---

## Building a Compound Component

### Step 1: Create Context

Context allows parent and child components to share state.

```jsx
import { createContext, useContext, useState } from "react";

// 1. Create context for sharing state
const CounterContext = createContext();
```

---

### Step 2: Create Parent Component

```jsx
// Parent provides state to children via context
function Counter({ children }) {
  const [count, setCount] = useState(0);
  const increase = () => setCount((c) => c + 1);
  const decrease = () => setCount((c) => c - 1);

  return (
    <CounterContext.Provider value={{ count, increase, decrease }}>
      <span>{children}</span>
    </CounterContext.Provider>
  );
}
```

**How It Works:** Manages state, provides to children via Provider, renders child components.

---

### Step 3: Create Child Components

Child components consume the shared context to access state and functions.

```jsx
// Display the count
function Count() {
  const { count } = useContext(CounterContext);
  return <span>{count}</span>;
}

// Display a label
function Label({ children }) {
  return <span>{children}</span>;
}

// Increase button
function Increase({ icon }) {
  const { increase } = useContext(CounterContext);
  return <button onClick={increase}>{icon}</button>;
}

// Decrease button
function Decrease({ icon }) {
  const { decrease } = useContext(CounterContext);
  return <button onClick={decrease}>{icon}</button>;
}
```

**Understanding:** `useContext()` accesses shared state. Each component is independent.

---

### Step 4: Attach Children to Parent

```jsx
Counter.Count = Count;
Counter.Label = Label;
Counter.Increase = Increase;
Counter.Decrease = Decrease;

export default Counter;
```

**Why:** Clean API (`Counter.Count`), namespace shows they belong together, better discoverability.

---

## Using the Compound Component

### Flexible Composition

```jsx
import Counter from "./Counter";

export default function App() {
  return (
    <div>
      <h1>Compound Component Pattern</h1>

      {/* Standard layout */}
      <Counter>
        <Counter.Label>My super flexible counter</Counter.Label>
        <Counter.Increase icon="+" />
        <Counter.Count />
        <Counter.Decrease icon="-" />
      </Counter>

      {/* Different layout - same components! */}
      <Counter>
        <Counter.Decrease icon="👎" />
        <Counter.Count />
        <Counter.Increase icon="👍" />
      </Counter>
    </div>
  );
}
```

**Benefits:** Flexible ordering, use only what you need, no prop drilling, readable.

---

## Complete Pattern Flow

1. Context created → Parent provides state → Children consume via `useContext()`
2. Children attached as properties → User composes flexibly → State shared automatically

---

## Key Benefits

✓ **Flexibility**: Arrange components in any order or combination  
✓ **Separation of Concerns**: Each component has single responsibility  
✓ **Clean API**: Intuitive `Parent.Child` naming  
✓ **No Prop Drilling**: Context handles state sharing  
✓ **Reusability**: Mix and match components as needed

---

## Real-World Examples

**React Router:** `<Routes><Route /></Routes>`  
**Radix UI:** `<Dialog><Dialog.Trigger /><Dialog.Content /></Dialog>`

---

## When to Use

**✅ Use:** Tight component relationships, flexible composition, avoid boolean props  
**❌ Don't use:** Unrelated components, simple props sufficient

---

## Important Notes

⚠️ **Context Required**: Children must be descendants of the parent (context provider)  
⚠️ **Naming Convention**: Attach children as properties (`Parent.Child`)  
⚠️ **Custom Hook**: Consider creating `useCounterContext()` for better error messages  
⚠️ **TypeScript**: Compound components work great with TypeScript for type safety

---

## Advanced: Custom Hook for Context

```jsx
function useCounterContext() {
  const context = useContext(CounterContext);
  if (!context) throw new Error("Must be used within <Counter>");
  return context;
}

// Use: const { count } = useCounterContext(); // Better errors
```

---

**Next Step:** [Building a Modal Window](./06-building-a-modal-window.md)
