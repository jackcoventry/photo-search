import { useEffect, useState } from "react";
import { useAppContext } from "../app/Context";

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

  const query = state.userDetails?.topic || "";
  const currentPhoto = state.currentPhoto;
  const seenPhotoIds = state.seenPhotoIds;

  useEffect(() => {
    if (!query || currentPhoto) return;

    const controller = new AbortController();

    async function search() {
      setStatus("loading");

      // TODO: Add multiple request attempts

      try {
        const result = await searchPhotos(query || "", controller.signal);

        if (!result) {
          setStatus("empty-result");
          return;
        }

        if (seenPhotoIds.includes(result.id)) {
          return;
        }

        dispatch({
          type: "PHOTO_FOUND",
          query: query!,
          photo: result,
        });

        setStatus("success");
        return;
      } catch (error) {
        setStatus("error");

        if (controller.signal.aborted) return;
      }
    }

    void search();

    return () => {
      controller.abort();
    };
  }, [query, currentPhoto, seenPhotoIds, dispatch]);

  return {
    status,
  };
}
