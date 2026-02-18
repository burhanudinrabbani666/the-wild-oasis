# Authorization Protecting Routes

Creating Protected Route for `<AppLayout/>` Components

```jsx
// App.js
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
```

```js
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
        <Spinner />;
      </FullPage>
    );

  // 4. if there is a user, render the app
  return children;
}

export default ProtectedRoute;
```

2. Creating API Call

```js
// useAuthServices.js

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession(); // Get data from LocalStorage

  if (!session.session) null;

  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);

  return data.user;
}
```

3. Creating custom Hooks

```js
// useUser.js

export function useUser() {
  const { data: user, isPending: userLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });

  return { user, userLoading, isAuthenticated: user?.role === "authenticated" };
}
```

4. Using useQuery for chacing data

```js
// useLogin.js

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: login, isPending: loginLoading } = useMutation({
    mutationFn: ({ email, password }) =>
      loginApi({
        email,
        password,
      }),
    onSuccess: (user) => {
      queryClient.setQueriesData(["user"], user); // This
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error("Provide email or password are incorrect");
    },
  });

  return { login, loginLoading };
}
```

5. Deleting value in form if success or failed Login

```js
// LoginForm.jsx

function handleSubmit(event) {
  event.preventDefault();
  if (!email || !password) return;

  login(
    { email, password },
    {
      onSettled: () => {
        setEmail("");
        setPassword("");
      },
    },
  );
}
```

Next: [User logout](./17-user-logout.md)
