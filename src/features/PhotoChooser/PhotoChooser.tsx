import { useAppContext } from "../../app/Context";
import { usePhotoSearch } from "../../hooks/usePhotoSearch";

function getStatusMessage(status: string) {
  switch (status) {
    case "loading":
    case "idle":
      return "Finding a photo...";
    case "empty":
      return "No photos found for this topic!";
    case "rate-limited":
      return "Search limit reached! Please try again later";
    default:
      return "Unable to load an image";
  }
}

export function PhotoChooser() {
  const { state, dispatch } = useAppContext();
  const { status } = usePhotoSearch();
  const photo = state.currentPhoto;

  function handleReject() {
    dispatch({ type: "REJECT_PHOTO" });
  }

  function handleAccept() {
    //
  }

  return (
    <div>
      <h1>Choose your photo</h1>

      {photo ? (
        <div>
          <img src={photo.url} alt={photo.alt} />
          <p>Photo by {photo.attribution}</p>
          <button type="button" onClick={handleReject}>
            Reject
          </button>

          <button type="button" onClick={handleAccept}>
            Accept
          </button>
        </div>
      ) : (
        <p role="status" aria-live="polite">
          {getStatusMessage(status)}
        </p>
      )}
    </div>
  );
}
