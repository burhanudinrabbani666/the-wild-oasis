import Heading from "../ui/Heading";
import Row from "../ui/Row";
import { getCabins } from "../services/apiCabins";
import CabinTable from "../features/cabins/CabinTable";

function Cabins() {
  return (
    <>
      <Row itemProp="horizontal">
        <Heading as="h1">All cabins</Heading>
        <p>Filter / sort</p>
      </Row>

      <Row>
        <CabinTable></CabinTable>
      </Row>
    </>
  );
}

export default Cabins;
