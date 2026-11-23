import { type UserDetails } from "../features/UserForm/schema";

export type AppState = {
  userDetails: UserDetails | null;
  seenPhotoIds: string[];
  currentPhoto: Photo | null;
  acceptedPhoto: Photo | null;
};

export const initialState: AppState = {
  userDetails: null,
  seenPhotoIds: [],
  currentPhoto: null,
  acceptedPhoto: null,
};

export type Photo = {
  id: string;
  url: string;
  attribution: string;
};

export type AppAction =
  | { type: "SUBMIT_USER_DETAILS"; payload: UserDetails }
  | { type: "PHOTO_FOUND"; photo: Photo; query: string }
  | { type: "REJECT_PHOTO" }
  | { type: "ACCEPT_PHOTO" };

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
    case "REJECT_PHOTO":
      return {
        ...state,
        currentPhoto: null,
        acceptedPhoto: null,
      };

    case "ACCEPT_PHOTO":
      if (!state.currentPhoto) return state;

      return {
        ...state,
        acceptedPhoto: state.currentPhoto,
      };
    default:
      return state;
  }
}
