import { useEffect, useRef } from "react";

export function useOutsideClick(handler, listenCapturing = true) {
  const ref = useRef();

  useEffect(() => {
    function handleClick(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        console.log(ref.current, event.target);
        console.log("click ouside");
        handler();
      }
    }

    document.addEventListener("click", handleClick, {
      capture: listenCapturing,
    });

    return () =>
      document.removeEventListener("click", handleClick, {
        capture: listenCapturing,
      });
  }, [handler, listenCapturing]);

  return ref;
}
