import { useReducer, type PropsWithChildren } from "react";

import { AppContext } from "./Context";
import { appReducer, initialState } from "./reducer";

export function AppProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
