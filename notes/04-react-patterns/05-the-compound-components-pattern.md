# The compound components pattern

The most use one

```jsx
import { useState } from "react";
import { createContext, useContext } from "react";

// 1. Create Context
const CounterContext = createContext();

// 2. Create Parent Components
function Counter({ children }) {
  const [count, setCount] = useState(0);

  const increase = () => setCount((count) => count + 1);
  const decrease = () => setCount((count) => count - 1);

  return (
    <CounterContext.Provider value={{ count, increase, decrease }}>
      <span>{children}</span>
    </CounterContext.Provider>
  );
}

// 3. Create child comppunents
function Count() {
  const { count } = useContext(CounterContext);

  return <span>{count}</span>;
}

function Label({ children }) {
  return <span>{children}</span>;
}

function Increase({ icon }) {
  const { increase } = useContext(CounterContext);

  return <button onClick={increase}>{icon}</button>;
}

function Decrease({ icon }) {
  const { decrease } = useContext(CounterContext);

  return <button onClick={decrease}>{icon}</button>;
}

// 4. Add child properties as porperties to parent components
Counter.Count = Count;
Counter.Label = Label;
Counter.Increase = Increase;
Counter.Decrease = Decrease;

export default Counter;
```

```jsx
import Counter from "./Counter";
import "./styles.css";

export default function App() {
  return (
    <div>
      <h1>Compound Component Pattern</h1>

      <Counter>
        <Counter.Label>My super Flexiable counter</Counter.Label>
        <Counter.Increase icon="+" />
        <Counter.Count />
        <Counter.Decrease icon="-" />
      </Counter>
    </div>
  );
}
```

Next: [Building a modal window](./06-building-a-modal-window.md)
