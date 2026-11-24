import { useAppContext } from "../../app/Context";
import { usePhotoSearch } from "../../hooks/usePhotoSearch";
import { useNavigate } from "react-router";

function getStatusMessage(status: string) {
  switch (status) {
    case "loading":
    case "idle":
      return "Finding a photo...";
    case "empty-result":
      return "No photos found for this topic!";
    case "rate-limit":
      return "Search limit reached! Please try again later";
    default:
      return "Unable to load an image";
  }
}

export function PhotoChooser() {
  const { state, dispatch } = useAppContext();
  const { status } = usePhotoSearch();
  const navigate = useNavigate();

  const photo = state.currentPhoto;

  function handleReject() {
    dispatch({ type: "REJECT_PHOTO" });
  }

  async function handleAccept() {
    if (!photo) return;

    dispatch({ type: "ACCEPT_PHOTO" });

    await navigate("/result");
  }

  return (
    <article className="flex flex-col gap-4">
      <h1>Choose your photo</h1>

      <section className="bg-white shadow-md rounded-2xl p-4 flex flex-col gap-6">
        {photo ? (
          <>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleReject}
                className="bg-red-500 text-white p-4 rounded-md hover:bg-black cursor-pointer"
              >
                Reject
              </button>

              <button
                type="button"
                onClick={handleAccept}
                className="bg-green-500 text-white p-4 rounded-md hover:bg-black cursor-pointer"
              >
                Accept
              </button>
            </div>
            <div className="mx-auto max-w-2xl flex flex-col gap-4">
              <figure className="flex flex-col gap-4">
                <img src={photo.url} alt={photo.alt} />
                <figcaption>
                  Photo by {photo.author}
                  <a
                    href={photo.externalLink}
                    target="_blank"
                    rel="noopener"
                    className="text-gray-800 hover:text-green-500 block text-xs"
                  >
                    View on unsplash
                  </a>
                </figcaption>
              </figure>
            </div>
          </>
        ) : (
          <>
            <p role="status" aria-live="polite">
              {getStatusMessage(status)} ({status})
            </p>
            {status === "error" && (
              <button
                type="button"
                onClick={handleReject}
                className="mt-4 rounded-lg border px-5 py-2"
              >
                Try again
              </button>
            )}
          </>
        )}
      </section>
    </article>
  );
}
