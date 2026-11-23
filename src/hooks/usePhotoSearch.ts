import { useEffect } from "react";
import { useAppContext } from "../app/Context";

import { searchPhotos } from "../lib/unsplash";

export function usePhotoSearch() {
  const { state, dispatch } = useAppContext();

  const query = state.userDetails?.topic || "";
  const currentPhoto = state.currentPhoto;
  const seenPhotoIds = state.seenPhotoIds;

  useEffect(() => {
    if (!query || currentPhoto) return;

    const controller = new AbortController();

    async function search() {
      try {
        const result = await searchPhotos(query || "", controller.signal);

        if (!result || seenPhotoIds.includes(result.id)) {
          return;
        }

        dispatch({
          type: "PHOTO_FOUND",
          query: query!,
          photo: result,
        });

        return;
      } catch (error) {
        //
      }
    }

    void search();

    return () => {
      controller.abort();
    };
  }, [query, currentPhoto, seenPhotoIds, dispatch]);

  return {
    status: "ok",
  };
}
