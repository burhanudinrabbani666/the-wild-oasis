import styled from "styled-components";
import GlobalStyle from "./styles/GlobalStyle";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Heading from "./ui/Heading";
import Row from "./ui/Row";

// the Most convetional is using styledApp because the components named App
const StyledApp = styled.div`
  padding: 20px;
`;

function App() {
  return (
    // Global components shoudl dont have any children
    <>
      <GlobalStyle />
      <StyledApp>
        <Row itemProp="vertical">
          <Row itemProp="horizontal">
            <Heading as="h1">The Wild Oasis</Heading>

            <div>
              <Heading as="h2">Check in and out</Heading>
              <Button onClick={() => alert("check in")}>Check in</Button>
              <Button
                variation="secondary"
                size="small"
                onClick={() => alert("Check out")}
              >
                Check out
              </Button>
            </div>
          </Row>

          <Row itemProp="vertical">
            <Heading as="h3">Form</Heading>
            <form action="">
              <Input type="number" placeholder="Number of guests" />
              <Input type="number" placeholder="Number of guests" />
            </form>
          </Row>
        </Row>
      </StyledApp>
    </>
  );
}

export default App;
