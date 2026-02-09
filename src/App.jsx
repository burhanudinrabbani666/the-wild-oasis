import styled from "styled-components";
import GlobalStyle from "./styles/GlobalStyle";
import Button from "./ui/Button";
import Input from "./ui/Input";

const H1 = styled.h1`
  font-size: 30px;
  font-weight: 600;
  background-color: green;
`;

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
        <H1>The Wild Oasis</H1>
        <Button onClick={() => alert("check in")}>Check in</Button>
        <Button onClick={() => alert("Check out")}>Check out</Button>

        <Input type="number" placeholder="Number of guests" />
      </StyledApp>
    </>
  );
}

export default App;
