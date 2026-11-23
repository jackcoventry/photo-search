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
    const rateLimited =
      response.status === 429 ||
      (response.status === 403 &&
        response.headers.get("x-ratelimit-remaining") === "0");

    throw new Error(rateLimited ? "rate-limit" : "failed");
  }

  return {
    id: data.id,
    url: data.urls.regular,
    thumbnailUrl: data.urls.thumb,
    alt: data.alt_description || data.description,
    author: data.user.username,
    externalLink: data.links.html,
  };
}
