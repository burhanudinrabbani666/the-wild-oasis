import styled, { css } from "styled-components";

const Row = styled.div`
  display: flex;

  ${(props) =>
    props.itemProp === "horizontal" &&
    css`
      justify-content: space-between;
      align-items: center;
    `}

  ${(props) =>
    props.itemProp === "vertical" &&
    css`
      flex-direction: column;
      gap: 1.6rem;
      width: 100%;
    `}
`;

export default Row;
