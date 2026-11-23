import { Navigate } from "react-router";
import { useAppContext } from "../app/Context";
import { usePhotoSearch } from "../hooks/usePhotoSearch";
import { PhotoChooser } from "../features/PhotoChooser/PhotoChooser";

export function ChoosePhotoPage() {
  const { state } = useAppContext();
  const { status } = usePhotoSearch();

  // Redirect back to previous page if user visits this URL directly
  if (!state.userDetails) {
    return <Navigate to="/" replace />;
  }

  return <PhotoChooser />;
}
