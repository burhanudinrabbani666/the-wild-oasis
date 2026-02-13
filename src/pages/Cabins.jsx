import Heading from "../ui/Heading";
import Row from "../ui/Row";
import CabinTable from "../features/cabins/CabinTable";
import AddCabin from "../features/cabins/AddCabin";
import CabinTableOperation from "../features/cabins/CabinTableOperation";

function Cabins() {
  return (
    <>
      <Row itemProp="horizontal">
        <Heading as="h1">All cabins</Heading>
        <CabinTableOperation></CabinTableOperation>
      </Row>

      <Row itemProp="vertical">
        <CabinTable />

        <AddCabin />
      </Row>
    </>
  );
}

export default Cabins;
