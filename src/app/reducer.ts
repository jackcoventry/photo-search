import { type UserDetails } from "../features/UserForm/schema";

export type AppState = {
  userDetails: UserDetails | null;
};

export const initialState: AppState = {
  userDetails: null,
};

export type AppAction = { type: "SUBMIT_USER_DETAILS"; payload: UserDetails };

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SUBMIT_USER_DETAILS": {
      return {
        ...state,
        userDetails: action.payload,
      };
    }
    default:
      return state;
  }
}
