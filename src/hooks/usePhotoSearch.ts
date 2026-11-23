import { useEffect } from "react";
import { useAppContext } from "../app/Context";

import { searchPhotos } from "../lib/unsplash";

export function usePhotoSearch() {
  const { state, dispatch } = useAppContext();

  const query = state.userDetails?.topic || "";

  useEffect(() => {
    if (!query) return;

    const controller = new AbortController();

    async function search() {
      try {
        const result = await searchPhotos(query || "", controller.signal);

        if (!result) {
          return;
        }

        console.log("usePhotoSearch", JSON.stringify(result));

        dispatch({
          type: "PHOTO_FOUND",
          query: query,
          photo: {
            id: result.photo.id,
            url: result.photo.urls.regular,
          },
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
  }, [query, dispatch]);

  return {
    status: "ok",
  };
}
