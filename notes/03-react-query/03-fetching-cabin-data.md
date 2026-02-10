# Fetching cabin data

```js
export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}
```

```jsx
function CabinTable() {

// fetch data using useQuery
const {
    isPending,
    data: cabins,
    error,
  } = useQuery({
    queryKey: [`cabin`],
    queryFn: getCabins,
  });

  if (isPending) return <Spinner />;

  return (
  )}
```

```jsx
function CabinRow({ cabin }) {
  const { name, maxCapacity, regulerPrice, discount, description, image } =
    cabin;

  return (
    <TableRow role="row">
      <Img src={image} alt={name} />
      <Cabin>{name}</Cabin>
      <div>Fits up to {maxCapacity} guest</div>
      <Price>{formatCurrency(regulerPrice)}</Price>
      <Discount>{formatCurrency(discount)}</Discount>
      <button>Delete</button>
    </TableRow>
  );
}

export default CabinRow;
```

Next: [Mutations deleting cabins](./04-mutations-deleting-cabins.md)
