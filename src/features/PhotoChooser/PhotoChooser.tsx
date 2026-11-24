import { useRef } from "react";
import { useAppContext } from "../../app/Context";
import { usePhotoSearch } from "../../hooks/usePhotoSearch";
import { Link, useNavigate } from "react-router";

function getStatusMessage(status: string) {
  switch (status) {
    case "loading":
    case "idle":
    case "success":
      return "Finding a photo...";
    case "empty-result":
      return "No photos found for this topic!";
    case "rate-limit":
      return "Search limit reached! Please try again later";
    case "retry-needed":
      return "We couldn't find a photo you haven't seen yet. Please try again.";
    default:
      return "Unable to load an image";
  }
}

export function PhotoChooser() {
  const { state, dispatch } = useAppContext();
  const { status, retry } = usePhotoSearch();
  const navigate = useNavigate();
  const headingRef = useRef<HTMLHeadingElement>(null);

  const photo = state.currentPhoto;

  function handleReject() {
    headingRef.current?.focus();
    dispatch({ type: "REJECT_PHOTO" });
  }

  function handleRetry() {
    headingRef.current?.focus();
    retry();
  }

  async function handleAccept() {
    if (!photo) return;

    dispatch({ type: "ACCEPT_PHOTO" });

    await navigate("/result");
  }

  return (
    <article className="flex flex-col gap-4">
      <h1 ref={headingRef} tabIndex={-1}>
        Choose your photo
      </h1>

      <section className="bg-white shadow-md rounded-2xl p-4 flex flex-col gap-6">
        <p
          role="status"
          aria-live="polite"
          className={photo ? "sr-only" : undefined}
        >
          {photo
            ? "A new photo has been loaded: please accept or reject it"
            : getStatusMessage(status)}
        </p>
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
          <div className="flex flex-col gap-4">
            {status === "loading" && (
              <span className="w-24 mx-auto p-4 motion-reduce:hidden">
                <svg
                  fill="hsl(228, 97%, 42%)"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <circle cx="4" cy="12" r="3">
                    <animate
                      id="spinner_qFRN"
                      begin="0;spinner_OcgL.end+0.25s"
                      attributeName="cy"
                      calcMode="spline"
                      dur="0.6s"
                      values="12;6;12"
                      keySplines=".33,.66,.66,1;.33,0,.66,.33"
                    />
                  </circle>
                  <circle cx="12" cy="12" r="3">
                    <animate
                      begin="spinner_qFRN.begin+0.1s"
                      attributeName="cy"
                      calcMode="spline"
                      dur="0.6s"
                      values="12;6;12"
                      keySplines=".33,.66,.66,1;.33,0,.66,.33"
                    />
                  </circle>
                  <circle cx="20" cy="12" r="3">
                    <animate
                      id="spinner_OcgL"
                      begin="spinner_qFRN.begin+0.2s"
                      attributeName="cy"
                      calcMode="spline"
                      dur="0.6s"
                      values="12;6;12"
                      keySplines=".33,.66,.66,1;.33,0,.66,.33"
                    />
                  </circle>
                </svg>
              </span>
            )}

            {(status === "error" ||
              status === "retry-needed" ||
              status === "rate-limit") && (
              <button
                type="button"
                onClick={handleRetry}
                className="mt-4 bg-green-500 text-white p-4 rounded-md hover:bg-black cursor-pointer"
              >
                Try again
              </button>
            )}
          </div>
        )}
        <Link to="/" className="hover:text-green-500 cursor-pointer text-right">
          Change topic
        </Link>
      </section>
    </article>
  );
}
