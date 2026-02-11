# Abstaring react query

creating custom hooks

`useCabin.js`

```js
import { useQuery } from "@tanstack/react-query";
import { getCabins } from "../../services/apiCabins";

export function useCabin() {
  const {
    isPending,
    data: cabins,
    error,
  } = useQuery({
    queryKey: [`cabins`],
    queryFn: getCabins,
  });

  return { isPending, cabins, error };
}
```

`useCreateCabin.js`

```js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";

export function useCreateCabin() {
  const qureyClient = useQueryClient();

  const { mutate: createCabin, isPending: isCreating } = useMutation({
    mutationFn: (newCabin) => createEditCabin(newCabin),
    onSuccess: () => {
      toast.success("New Cabin Succefully created");
      qureyClient.invalidateQueries({ queryKey: ["cabins"] });
    },
    onError: (error) => toast.error(error.message),
  });

  return { createCabin, isCreating };
}
```

`useEditCabin.js`

```js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";

export function useEditCabin() {
  const qureyClient = useQueryClient();

  const { mutate: editCabin, isPending: isEditing } = useMutation({
    mutationFn: ({ newCabinData, id }) => createEditCabin(newCabinData, id),
    onSuccess: () => {
      toast.success("Cabin Succefully Edited");
      qureyClient.invalidateQueries({ queryKey: ["cabins"] });
    },
    onError: (error) => toast.error(error.message),
  });

  return { editCabin, isEditing };
}
```

Next: [Duplicating cabins](./12-duplicating-cabins.md)
