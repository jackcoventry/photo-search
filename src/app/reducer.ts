import { type UserDetails } from "../features/UserForm/schema";

export type AppState = {
  userDetails: UserDetails | null;
  seenPhotoIds: string[];
  currentPhoto: Photo | null;
};

export const initialState: AppState = {
  userDetails: null,
  seenPhotoIds: [],
  currentPhoto: null,
};

export type Photo = {
  id: string;
  url: string;
};

export type AppAction =
  | { type: "SUBMIT_USER_DETAILS"; payload: UserDetails }
  | { type: "PHOTO_FOUND"; photo: Photo; query: string };

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SUBMIT_USER_DETAILS": {
      return {
        ...state,
        userDetails: action.payload,
      };
    }
    case "PHOTO_FOUND": {
      return {
        ...state,
        currentPhoto: action.photo,
      };
    }
    default:
      return state;
  }
}
