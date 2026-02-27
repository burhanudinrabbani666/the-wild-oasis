import styled from "styled-components";
import { useUser } from "../features/authentication/useUser";
import Spinner from "./Spinner";
import { useNavigate } from "react-router";
import { useEffect } from "react";

const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
`;

function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  // 1. Load authentication user
  const { userLoading, isAuthenticated } = useUser();

  // 2. if there is NO authentication user, redirect to the login page
  useEffect(() => {
    if (!isAuthenticated && !userLoading) navigate("/login");
  }, [isAuthenticated, navigate, userLoading]);

  // 3. While Loading show Spinner
  if (userLoading)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );

  // 4. if there is a user, render the app
  return children;
}

export default ProtectedRoute;
