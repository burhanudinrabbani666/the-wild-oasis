import styled from "styled-components";
import { useRecentBooking } from "./useRecentBooking";
import { useRecentStays } from "./useRecentStays";
import Spinner from "../../ui/Spinner";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

function DashboardLayout() {
  const { isPending, bookings } = useRecentBooking();
  const { isPending: staysLoading, stays, confirmStays } = useRecentStays();

  if (isPending || staysLoading) return <Spinner />;

  console.log(bookings);

  return (
    <StyledDashboardLayout>
      <div>Statistics</div>
      <div>Todays activity</div>
      <div>Chart stay duration</div>
      <div>Chart sales</div>
    </StyledDashboardLayout>
  );
}

export default DashboardLayout;
