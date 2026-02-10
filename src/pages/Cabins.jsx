import { useEffect } from "react";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import { getCabins } from "../services/apiCabins";

function Cabins() {
  useEffect(() => {
    getCabins().then((data) => console.log(data));
  }, []);

  return (
    <Row itemProp="horizontal">
      <Heading as="h1">All cabins</Heading>
      <img
        src="https://oobhmhdqjancbyfnwdul.supabase.co/storage/v1/object/public/cabin-image/cabin-001.jpg"
        alt="cabin1"
      />
      <p>TEST</p>
    </Row>
  );
}

export default Cabins;
