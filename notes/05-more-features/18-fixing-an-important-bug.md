# Fixing important BUG

in `useLogin.js`

```js
    onSuccess: (user) => {
      queryClient.setQueriesData(["user"], user); // This
      navigate("/dashboard", { replace: true });
    },

```

to:

```js
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user.user); // This
      navigate("/dashboard", { replace: true });
    },
```

Next: [Building the sign up](./19-building-the-sign-up.md)
