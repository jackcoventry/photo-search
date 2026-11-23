import { useAppContext } from "../../app/Context";
import { usePhotoSearch } from "../../hooks/usePhotoSearch";

export function PhotoChooser() {
  const { state } = useAppContext();
  const { status } = usePhotoSearch();

  return (
    <div>
      <h1>Choose your photo</h1>

      {state.currentPhoto ? (
        <img src={state.currentPhoto.url} />
      ) : (
        <p>No photo found!</p>
      )}
    </div>
  );
}
