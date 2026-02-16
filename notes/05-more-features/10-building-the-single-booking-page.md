# Building the Single Booking Page

## Overview

Create a detail page for individual bookings that displays complete booking information. Users navigate from the bookings table to see full details.

---

## Adding Navigation Button

```jsx
import { HiEye } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

function BookingRow({ booking }) {
  const navigate = useNavigate();
  const { id: bookingId } = booking;

  return (
    <Table.Row>
      {/* ... booking data ... */}

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
    </Table.Row>
  );
}
```

Click "See Details" → navigates to `/bookings/123`.

---

## Custom Hook for Single Booking

### Fetching Individual Booking by ID

```js
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getBooking } from "../services/apiBookings";

export function useBooking() {
  const { bookingId } = useParams(); // Extract ID from URL

  const {
    isPending,
    data: booking,
    error,
  } = useQuery({
    queryKey: ["booking", bookingId], // Include ID in cache key
    queryFn: () => getBooking(bookingId),
    retry: false, // Don't retry if booking not found
  });

  return { isPending, booking, error };
}
```

**Understanding:**

- `useParams()`: Extracts `bookingId` from URL (`/bookings/:bookingId`)
- `queryKey: ["booking", bookingId]`: Separate cache per booking
- `retry: false`: Don't retry if booking doesn't exist (404)

---

## API Function

```js
export async function getBooking(id) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(*), guests(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking not found");
  }

  return data;
}
```

Fetches single booking with related cabin and guest data using `.single()`.

---

## Booking Detail Component

```jsx
import { useBooking } from "./useBooking";
import { useMoveBack } from "../hooks/useMoveBack";

function BookingDetail() {
  const { booking, isPending } = useBooking();
  const moveBack = useMoveBack();

  if (isPending) return <Spinner />;

  const { status, id } = booking;

  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };

  return (
    <>
      <Row type="horizontal">
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
```

Shows spinner while loading, then displays booking with status tag and details.

---

## BookingDataBox Component

```jsx
function BookingDataBox({ booking }) {
  const {
    startDate,
    endDate,
    numNights,
    cabinPrice,
    totalPrice,
    hasBreakfast,
    isPaid,
    guests: { fullName, email, countryFlag },
    cabins: { name: cabinName },
  } = booking;

  return (
    <Section>
      <Header>
        <p>
          {numNights} nights in {cabinName}
        </p>
        <p>
          {format(startDate, "MMM dd")} - {format(endDate, "MMM dd")}
        </p>
      </Header>
      <Guest>
        {countryFlag && <Flag src={countryFlag} />} {fullName} &bull; {email}
      </Guest>
      <DataItem label="Breakfast">{hasBreakfast ? "Yes" : "No"}</DataItem>
      <Price>
        {formatCurrency(totalPrice)} &mdash;{" "}
        {isPaid ? "Paid" : "Will pay at property"}
      </Price>
    </Section>
  );
}
```

Displays guest, stay details, breakfast, and payment info.

---

## Complete Flow

1. Click "See Details" → Navigate to `/bookings/123`
2. Route matches → `BookingDetail` renders
3. `useParams()` extracts `bookingId = 123`
4. `useQuery` fetches `getBooking(123)`
5. Spinner shows while loading
6. Data arrives → Display complete booking info
7. User can check in, check out, or go back

---

## Key Benefits

✓ **Dynamic Routing**: Each booking has unique URL  
✓ **Shareable Links**: Users can bookmark specific bookings  
✓ **Separate Cache**: Each booking cached independently  
✓ **Error Handling**: Gracefully handles non-existent bookings  
✓ **Full Details**: All related data (cabin, guest) in one view

---

## Important Notes

⚠️ **QueryKey with ID**: Include `bookingId` in queryKey for proper caching  
⚠️ **retry: false**: Prevents unnecessary retries for 404 errors  
**Next Step:** [Checking In a Booking](./11-checking-in-a-booking.md)
