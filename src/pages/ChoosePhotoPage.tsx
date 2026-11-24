import { Navigate } from "react-router";
import { useAppContext } from "../app/Context";
import { PhotoChooser } from "../features/PhotoChooser/PhotoChooser";

export function ChoosePhotoPage() {
  const { state } = useAppContext();

  // Redirect back to previous page if user visits this URL directly
  if (!state.userDetails) {
    return <Navigate to="/" replace />;
  }

  return <PhotoChooser />;
}
