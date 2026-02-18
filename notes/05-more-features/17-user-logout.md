# User Logout

0. Create Button Component for logout

```js
function Logout() {
  const { logout, logoutLoading } = useLogout();

  return (
    <ButtonIcon disabled={logoutLoading} onClick={logout}>
      {!logoutLoading ? <HiArrowRightOnRectangle /> : <SpinnerMini />}
    </ButtonIcon>
  );
}

export default Logout;
```

1. Create Function for Calling API - Auth, to SignOut

```js
export async function logout() {
  const { error } = await supabase.auth.signOut(); // Delete authentication from local storage

  if (error) throw new Error(error.message);
}
```

2. Create Custom Hooks

```js
export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: logout, isPending: logoutLoading } = useMutation({
    mutationFn: logoutAPI,
    onSuccess: () => {
      queryClient.removeQueries(); // remove chace from react query
      navigate("/login", { replace: true });
    },
  });

  return { logout, logoutLoading };
}
```

3. Implement on components

Next: [Fixing an important bug](./18-fixing-an-important-bug.md)
