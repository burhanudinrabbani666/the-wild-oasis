import { useContext } from "react";
import { DarkModeContext } from "./DarkModeCreateContext";

export function useDarkMode() {
  const context = useContext(DarkModeContext);

  if (context === undefined)
    throw new Error("Darkmode context is using outside darkmode provider");

  return context;
}
