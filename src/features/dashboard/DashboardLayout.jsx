import styled from "styled-components";
import { useRecentBooking } from "./useRecentBooking";
import { useRecentStays } from "./useRecentStays";
import Spinner from "../../ui/Spinner";
import Stats from "./Stats";
import { useCabin } from "../cabins/useCabin";
import SalesChart from "./SalesChart";
import DurationChart from "./DurationChart";
import Today from "../check-in-out/TodayActivity";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 40rem auto;
  gap: 2.4rem;
`;

function DashboardLayout() {
  const { isPending, bookings } = useRecentBooking();
  const {
    isPending: staysLoading,
    stays,
    confirmStays,
    numDays,
  } = useRecentStays();
  const { cabins, isPending: cabinLoading } = useCabin();

  if (isPending || staysLoading || cabinLoading) return <Spinner />;

  return (
    <StyledDashboardLayout>
      <Stats
        bookings={bookings}
        confirmedStays={confirmStays}
        numDays={numDays}
        cabinCount={cabins.length}
      />
      <Today />
      <DurationChart confirmedStays={confirmStays} />
      <SalesChart bookings={bookings} numDays={numDays} />
    </StyledDashboardLayout>
  );
}

export default DashboardLayout;
