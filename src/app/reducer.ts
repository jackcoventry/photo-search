export type AppState = {
  details: string;
};

export const initialState: AppState = {
  details: "Hello world!",
};

export type AppAction = { type: "SUBMIT_DETAILS"; payload: null };

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    default:
      return state;
  }
}
