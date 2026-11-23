import { useAppContext } from "../../app/Context";
import { usePhotoSearch } from "../../hooks/usePhotoSearch";

export function PhotoChooser() {
  const { state } = useAppContext();
  const { status } = usePhotoSearch();
  const photo = state.currentPhoto;

  return (
    <div>
      <h1>Choose your photo</h1>

      {photo ? <img src={photo.url} /> : <p>No photo found!</p>}
    </div>
  );
}
