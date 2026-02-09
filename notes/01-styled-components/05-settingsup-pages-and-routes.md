# Setting Up Pages and Routes

## Overview

React Router enables navigation between different pages without full page reloads, creating a single-page application (SPA) experience.

---

## Installation

```bash
npm i react-router-dom
```

---

## Project Structure

```
src/
├── pages/
│   ├── Dashboard.jsx
│   ├── Bookings.jsx
│   ├── Cabins.jsx
│   ├── Users.jsx
│   ├── Settings.jsx
│   ├── Account.jsx
│   ├── Login.jsx
│   └── PageNotFound.jsx
└── App.jsx
```

---

## Complete Setup

### `App.jsx`

```jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import GlobalStyles from "./styles/GlobalStyles";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import Cabins from "./pages/Cabins";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";

function App() {
  return (
    <>
      <GlobalStyles />

      <BrowserRouter>
        <Routes>
          {/* Root redirect */}
          <Route index element={<Navigate replace to="dashboard" />} />

          {/* Main routes */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="cabins" element={<Cabins />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
          <Route path="account" element={<Account />} />
          <Route path="login" element={<Login />} />

          {/* 404 - must be last */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
```

---

## Core Components

**BrowserRouter** - Wraps routing system, manages browser history  
**Routes** - Container that matches URL to routes  
**Route** - Defines path and component (`path`, `element`, `index`)  
**Navigate** - Redirects to another route (`replace`, `to`)

---

## Special Routes

### Index Route (Default)

```jsx
<Route index element={<Navigate replace to="dashboard" />} />
```

Handles root path `/` without needing a `path` prop

### Catch-All (404)

```jsx
<Route path="*" element={<PageNotFound />} />
```

Must be **last** - catches all undefined paths

---

## Navigation

### Link Component

```jsx
import { Link } from "react-router-dom";

<Link to="/dashboard">Dashboard</Link>;
```

### NavLink (Active State)

```jsx
import { NavLink } from "react-router-dom";

<NavLink to="/dashboard">Dashboard</NavLink>;
// Automatically adds .active class
```

### Programmatic

```jsx
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  function handleLogin() {
    navigate("/dashboard");
  }

  return <button onClick={handleLogin}>Login</button>;
}
```

---

## How It Works

```
URL change → BrowserRouter detects → Routes finds match → Renders component → No reload
```

---

## Common Patterns

**Dynamic Routes**

```jsx
<Route path="bookings/:id" element={<BookingDetail />} />
```

**Nested Routes**

```jsx
<Route path="bookings" element={<Layout />}>
  <Route index element={<List />} />
  <Route path=":id" element={<Detail />} />
</Route>
```

---

## Best Practices

**✅ Do:** Wrap Routes in BrowserRouter, use descriptive paths, include 404 route last, use `<Link>` not `<a>`  
**❌ Don't:** Forget BrowserRouter wrapper, place 404 first, use hardcoded URLs

---

## Key Points

- 🔥 BrowserRouter wraps all routing
- 🔥 Index route handles root `/`
- 🔥 Catch-all `*` must be last
- 🔥 Use Link/NavLink for navigation
- 🔥 No page reloads

---

**Next:** [Building the App Layout](./06-building-the-app-layout.md)
