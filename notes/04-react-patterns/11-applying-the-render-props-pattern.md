# Appying the render props pattern

using render props pattern

```jsx
<Table.Body
  data={cabins}
  render={(cabin) => <CabinRow cabin={cabin} key={cabin.id} />}
/>
```

```jsx
// render props pattern
function Body({ data, render }) {
  if (!data.length) return <Empty>No data to show at the moment</Empty>;

  return <StyledBody>{data.map(render)}</StyledBody>;
}
```

Next: [Building a reusable context menu](./12-building-a-reusable-context-menu.md)
