import { createContext, useContext, type Dispatch } from "react";

import type { AppAction, AppState } from "./reducer";

type AppContextValue = {
  state: AppState;
  dispatch: Dispatch<AppAction>;
};

export const AppContext = createContext<AppContextValue | null>(null);

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }

  return context;
}
