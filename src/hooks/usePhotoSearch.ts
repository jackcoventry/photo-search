import { useEffect, useState } from "react";
import { useAppContext } from "../app/Context";
import { getSearchQuery } from "../app/reducer";

import { searchPhotos } from "../lib/unsplash";

type SearchStatus =
  | "idle"
  | "loading"
  | "success"
  | "empty-result"
  | "error"
  | "rate-limit"
  | "retry-needed";

export function usePhotoSearch() {
  const { state, dispatch } = useAppContext();
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [retryCount, setRetryCount] = useState(0);

  function retry() {
    setRetryCount((count) => count + 1);
  }

  const query = state.userDetails ? getSearchQuery(state.userDetails) : "";
  const currentPhoto = state.currentPhoto;
  const seenPhotoIds = state.seenPhotoIds;

  useEffect(() => {
    if (!query || currentPhoto) return;

    const controller = new AbortController();

    async function search() {
      setStatus("loading");

      // TODO: Add multiple request attempts

      try {
        const result = await searchPhotos(query, controller.signal);

        if (controller.signal.aborted) return;

        if (!result) {
          setStatus("empty-result");
          return;
        }

        if (seenPhotoIds.includes(result.id)) {
          return;
        }

        dispatch({
          type: "PHOTO_FOUND",
          query,
          photo: result,
        });

        setStatus("success");

        return;
      } catch (error) {
        if (controller.signal.aborted) return;

        setStatus(
          error instanceof Error && error.message === "rate-limit"
            ? "rate-limit"
            : "error",
        );
      }
    }

    void search();

    return () => {
      controller.abort();
    };
  }, [query, currentPhoto, seenPhotoIds, dispatch, retryCount]);

  return {
    status,
    retry,
  };
}
