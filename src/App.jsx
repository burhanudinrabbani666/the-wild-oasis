import styled from "styled-components";
import GlobalStyle from "./styles/GlobalStyle";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Heading from "./ui/Heading";

// the Most convetional is using styledApp because the components named App
const StyledApp = styled.div`
  background-color: orangered;
  padding: 20px;
`;

function App() {
  return (
    // Global components shoudl dont have any children
    <>
      <GlobalStyle />
      <StyledApp>
        <Heading as="h1">The Wild Oasis</Heading>
        <Heading as="h2">Check in and out</Heading>
        <Button onClick={() => alert("check in")}>Check in</Button>
        <Button onClick={() => alert("Check out")}>Check out</Button>

        <Heading as="h3">Form</Heading>
        <Input type="number" placeholder="Number of guests" />
      </StyledApp>
    </>
  );
}

export default App;
