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
  thumbnailUrl: string;
  alt: string;
  author: string;
  externalLink: string;
};

export function getSearchQuery(userDetails: UserDetails): string {
  // Normalize the search query
  return (
    userDetails.topic === "other"
      ? (userDetails.other ?? "")
      : userDetails.topic
  )
    .trim()
    .toLowerCase();
}

export type AppAction =
  | { type: "SUBMIT_USER_DETAILS"; payload: UserDetails }
  | { type: "PHOTO_FOUND"; photo: Photo; query: string }
  | { type: "REJECT_PHOTO" }
  | { type: "ACCEPT_PHOTO" };

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SUBMIT_USER_DETAILS": {
      const hasQueryChanged =
        !state.userDetails ||
        getSearchQuery(state.userDetails) !== getSearchQuery(action.payload);

      return {
        ...state,
        userDetails: action.payload,
        currentPhoto: hasQueryChanged ? null : state.currentPhoto,
        acceptedPhoto: hasQueryChanged ? null : state.acceptedPhoto,
      };
    }
    case "PHOTO_FOUND": {
      if (
        !state.userDetails ||
        getSearchQuery(state.userDetails) !== action.query ||
        state.seenPhotoIds.includes(action.photo.id)
      ) {
        return state;
      }

      return {
        ...state,
        currentPhoto: action.photo,
        acceptedPhoto: null,
        seenPhotoIds: [...state.seenPhotoIds, action.photo.id],
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
