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

  const photo = Array.isArray(data) ? data[0] : data;
  if (!photo) return null;

  const altDescription =
    "alt_description" in photo ? photo.alt_description : undefined;
  const description = "description" in photo ? photo.description : undefined;

  return {
    id: photo.id,
    url: photo.urls.regular,
    thumbnailUrl: photo.urls.thumb,
    alt:
      (typeof altDescription === "string" && altDescription) ||
      (typeof description === "string" && description) ||
      `Photo of ${query}`,
    author: photo.user.username,
    externalLink: photo.links.html,
  };
}
