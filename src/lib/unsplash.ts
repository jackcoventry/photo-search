import { createApi } from "unsplash-js";
import type { Photo } from "../app/reducer";

const unsplash = createApi({
  accessKey: import.meta.env.VITE_UNSPLASH_ACCESS_KEY,
});

export async function searchPhotos(
  query: string,
  signal?: AbortSignal,
): Promise<Photo | null> {
  const { data, error, response } = await unsplash.GET("/photos/random", {
    params: {
      query: {
        query,
        content_filter: "high",
      },
    },
    signal,
  });

  if (response.status === 404) {
    return null;
  }

  if (error || !data) {
    throw new Error("Request failed");
  }

  // TODO: Handle errors gracefully

  return {
    id: data.id,
    url: data.urls.regular,
    alt: data.alt_description || data.description,
    attribution: data.photographerName,
  };
}
