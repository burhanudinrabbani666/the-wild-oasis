# Authentication User

Auth For Development purpose

1. Create account in supabase auth table
2. Get Auth call

```js
export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return data;
}
```

3. Create custom Hook `useLogin.js`

```js
export function useLogin() {
  const navigate = useNavigate();

  const { mutate: login, isPending: loginLoading } = useMutation({
    mutationFn: ({ email, password }) =>
      loginApi({
        email,
        password,
      }),
    onSuccess: () => {
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

4. Implement on Components

```js
const [email, setEmail] = useState("bani@example.com");
const [password, setPassword] = useState("141102");
const { login, loginLoading } = useLogin();

function handleSubmit(event) {
  event.preventDefault();
  if (!email || !password) return;

  login({ email, password });
}
```

- Still In deployment for authentication

Next: [Authentication protecting routes](./16-authentication-protecting-routes.md)
