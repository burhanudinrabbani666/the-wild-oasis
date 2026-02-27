# Displaying Today's Activity

## Overview

The dashboard shows bookings arriving (checking in) or departing (checking out) today. Uses Supabase's `.or()` filter to query only today's relevant bookings instead of fetching all bookings.

---

## API Function with Complex Query

```js
// apiBookings.js
import { getToday } from "../utils/helpers";

export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`,
    )
    .order("created_at");

  if (error) {
    console.error(error);
    throw new Error("Bookings could not be loaded");
  }

  return data;
}
```

**Understanding the Query:**

```sql
WHERE (status = 'unconfirmed' AND startDate = today)
   OR (status = 'checked-in' AND endDate = today)
```

Returns unconfirmed arrivals OR checked-in departures for today only. Database filtering vs client-side: 5 rows returned instead of 10,000.

---

## Helper: getToday

```js
export const getToday = () => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today.toISOString(); // "2024-02-26T00:00:00.000Z"
};
```

## Custom Hook

```js
export function useTodayActivity() {
  const { data: activities, isPending } = useQuery({
    queryFn: getStaysTodayActivity,
    queryKey: ["today-activity"],
  });
  return { activities, isPending };
}
```

---

## Today Activity Component

```jsx
// Today.jsx
import { useTodayActivity } from "../features/check-in-out/useTodayActivity";
import Spinner from "../ui/Spinner";
import TodayItem from "./TodayItem";

function Today() {
  const { activities, isPending } = useTodayActivity();

  return (
    <StyledToday>
      <Row type="horizontal">
        <Heading as="h2">Today</Heading>
      </Row>

      {isPending ? (
        <Spinner />
      ) : activities?.length > 0 ? (
        <TodayList>
          {activities.map((activity) => (
            <TodayItem activity={activity} key={activity.id} />
          ))}
        </TodayList>
      ) : (
        <NoActivity>No activity today</NoActivity>
      )}
    </StyledToday>
  );
}

export default Today;
```

**Conditional Rendering:**

1. Loading → Show spinner
2. Has activities → Map and render `TodayItem`
3. No activities → Show "No activity today"

---

## TodayItem Component

```jsx
// TodayItem.jsx
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import Tag from "../ui/Tag";
import Flag from "../ui/Flag";
import CheckoutButton from "./CheckoutButton";

function TodayItem({ activity }) {
  const { id, status, guests, numNights } = activity;

  return (
    <StyledTodayItem>
      {/* Status indicator */}
      {status === "unconfirmed" && <Tag type="green">Arriving</Tag>}
      {status === "checked-in" && <Tag type="blue">Departing</Tag>}

      {/* Guest info */}
      <Flag src={guests.countryFlag} alt={`Flag of ${guests.nationality}`} />
      <Guest>{guests.fullName}</Guest>
      <div>{numNights} nights</div>

      {/* Action buttons */}
      {status === "unconfirmed" && (
        <Button
          size="small"
          variation="primary"
          as={Link}
          to={`/checkin/${id}`}
        >
          Check in
        </Button>
      )}
      {status === "checked-in" && <CheckoutButton bookingId={id} />}
    </StyledTodayItem>
  );
}

export default TodayItem;
```

**Understanding:**

- **Arriving:** Unconfirmed bookings with today's start date → show "Check in" button
- **Departing:** Checked-in bookings with today's end date → show "Check out" button
- Guests object joined from API query

---

## Complete Flow

1. Dashboard loads → query Supabase with `.or()` filter
2. Returns arrivals (unconfirmed, start today) + departures (checked-in, end today)
3. Maps to `TodayItem` with tags and action buttons

---

## Key Benefits

✓ **Efficient Querying**: Only fetches today's bookings, not all data  
✓ **Real-Time Dashboard**: Shows current day's check-ins/check-outs  
✓ **Action Buttons**: Direct links to check in or check out  
✓ **Visual Indicators**: Color-coded tags for status  
✓ **Empty State**: Shows message when no activity

---

## Important Notes

⚠️ **Complex OR Query**: Requires both conditions in specific format  
⚠️ **Date Comparison**: Uses ISO format (`toISOString()`) for consistency  
⚠️ **Guest Join**: Must select nested fields with `guests(fullName, ...)`  
⚠️ **Fixed Typo**: "itemProp" → "type" in Row component, "boundries" → "boundaries"  
⚠️ **Time Zone**: `getToday()` uses UTC to match database timestamps

---

## Invalidating Today's Activity

```js
// After checking in or checking out
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["bookings"] });
  queryClient.invalidateQueries({ queryKey: ["today-activity"] }); // Refresh today widget
};
```

Ensures dashboard updates after status changes.

---

**Next Step:** [Error Boundaries](./30-error-boundaries.md)
