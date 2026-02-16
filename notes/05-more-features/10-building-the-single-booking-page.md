# Building the single booking page

implement button for see Detail

- Creating useBooking {for single page}

```js
<Menus.Menu>
  <Menus.Toggle id={bookingId} />
  <Menus.List id={bookingId}>
    <Menus.Button
      icon={<HiEye />}
      onClick={() => navigate(`/bookings/${bookingId}`)}
    >
      See Details
    </Menus.Button>
  </Menus.List>
</Menus.Menu>
```

- get id by params

```js
export function useBooking() {
  const { bookingId } = useParams();

  const {
    isPending,
    data: booking,
    error,
  } = useQuery({
    queryKey: [`bookings`],
    queryFn: () => getBooking(bookingId),
    retry: false,
  });

  return { isPending, booking, error };
}
```

- implement on components

```js
function BookingDetail() {
  const { booking, isPending } = useBooking();
  const moveBack = useMoveBack();

  if (isPending) return <Spinner />;
  console.log(booking);

  const { status, id } = booking;

  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };

  return (
    <>
      <Row itemProp="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking #{id}</Heading>
          <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      <ButtonGroup>
        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;
```

Next: [Checking in a booking](./11-checking-in-a-booking.md)
