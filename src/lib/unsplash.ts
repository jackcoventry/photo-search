import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: import.meta.env.VITE_UNSPLASH_ACCESS_KEY,
});

export async function searchPhotos(query: string, signal?: AbortSignal) {
  const { data } = await unsplash.GET("/photos/random", {
    params: {
      query: {
        query,
        content_filter: "high",
      },
    },
    signal,
  });

  // TODO: Handle errors gracefully

  return data;
}
