# Building Sidebar and Navigation

## Overview

Learn to style React Router components and add icons for professional sidebar navigation using styled-components and react-icons.

---

## Styling React Router Components

### Basic Pattern

Wrap React Router components with styled-components:

```jsx
import styled from "styled-components";
import { NavLink } from "react-router-dom";

// Wrap NavLink with styled-components
const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 1.2rem;

  color: var(--color-grey-600);
  font-size: 1.6rem;
  font-weight: 500;
  padding: 1.2rem 2.4rem;
  transition: all 0.3s;

  &:hover {
    color: var(--color-grey-800);
    background-color: var(--color-grey-50);
    border-radius: var(--border-radius-sm);
  }

  /* NavLink automatically adds .active class to current route */
  &.active {
    color: var(--color-grey-800);
    background-color: var(--color-grey-50);
    border-radius: var(--border-radius-sm);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }

  &:hover svg,
  &.active svg {
    color: var(--color-brand-600);
  }
`;
```

---

## Installing React Icons

```bash
npm i react-icons
```

Provides access to popular icon sets: Heroicons, Font Awesome, Material Design, etc.

---

## Complete Navigation Example

```jsx
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineCalendarDays,
  HiOutlineHomeModern,
  HiOutlineCog6Tooth,
  HiOutlineUsers,
} from "react-icons/hi2";

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  color: var(--color-grey-600);
  font-size: 1.6rem;
  font-weight: 500;
  padding: 1.2rem 2.4rem;
  transition: all 0.3s;

  &:hover {
    color: var(--color-grey-800);
    background-color: var(--color-grey-50);
  }

  &.active {
    color: var(--color-grey-800);
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-400);
  }

  &:hover svg,
  &.active svg {
    color: var(--color-brand-600);
  }
`;

function MainNav() {
  return (
    <nav>
      <NavList>
        <li>
          <StyledNavLink to="/dashboard">
            <HiOutlineHome />
            <span>Home</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/bookings">
            <HiOutlineCalendarDays />
            <span>Bookings</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/cabins">
            <HiOutlineHomeModern />
            <span>Cabins</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/users">
            <HiOutlineUsers />
            <span>Users</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/settings">
            <HiOutlineCog6Tooth />
            <span>Settings</span>
          </StyledNavLink>
        </li>
      </NavList>
    </nav>
  );
}

export default MainNav;
```

---

## How It Works

```
1. Wrap NavLink with styled()
   ↓
2. Write CSS inside template literals
   ↓
3. Use &.active for current route styling
   ↓
4. Import icons from react-icons
   ↓
5. Add icon + text in StyledNavLink
   ↓
6. NavLink auto-adds .active class to current route
```

---

## Icon Libraries

**Popular Icon Sets:**

```jsx
import { HiOutlineHome } from "react-icons/hi2"; // Heroicons v2
import { FaUser } from "react-icons/fa"; // Font Awesome
import { MdSettings } from "react-icons/md"; // Material Design
import { AiOutlineStar } from "react-icons/ai"; // Ant Design
```

---

## Key Features

**NavLink Benefits:**

- Automatically adds `.active` class to current route
- No manual state management needed
- Built-in active route detection

**Styling Tips:**

- Style both normal and `:hover` states
- Style `.active` class for current route
- Style `svg` separately for icon customization
- Use transitions for smooth effects

---

## Key Points

- 🔥 **Wrap with styled():** `styled(NavLink)` creates styled version
- 🔥 **Active Class:** NavLink auto-adds `.active` to current route
- 🔥 **React Icons:** Import from `react-icons/hi2` (or other sets)
- 🔥 **Icon Sizing:** Control with `svg` selector
- 🔥 **Transitions:** Add smooth hover/active effects

---

**Next:** [Section 2 - Supabase Crash Course](../02-supabase/01-what-is-supabase.md)
