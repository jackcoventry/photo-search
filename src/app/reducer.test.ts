import { describe, expect, it } from "vitest";
import { appReducer, initialState, type Photo } from "./reducer";

const photo: Photo = {
  id: "seen-photo",
  url: "https://example.com/photo.jpg",
  thumbnailUrl: "https://example.com/thumb.jpg",
  alt: "Mountain landscape",
  author: "Photographer",
  externalLink: "https://example.com/photo",
};

function changeTopic() {
  const userDetails = {
    firstName: "James",
    lastName: "Bond",
    topic: "travel" as const,
  };

  return appReducer(
    {
      ...initialState,
      userDetails,
      currentPhoto: photo,
      acceptedPhoto: photo,
      seenPhotoIds: [photo.id],
    },
    { type: "SUBMIT_USER_DETAILS", payload: { ...userDetails, topic: "cars" } },
  );
}

describe("topic changes", () => {
  it("clears selections but preserves session photo history", () => {
    const state = changeTopic();

    expect(state.userDetails?.topic).toBe("cars");
    expect(state.currentPhoto).toBeNull();
    expect(state.acceptedPhoto).toBeNull();
    expect(state.seenPhotoIds).toEqual([photo.id]);
  });

  it("refuses a previously seen photo under new topic but accepts new one", () => {
    const state = changeTopic();
    expect(
      appReducer(state, { type: "PHOTO_FOUND", query: "cars", photo }),
    ).toEqual(state);
    const newPhoto = { ...photo, id: "new-photo" };
    const result = appReducer(state, {
      type: "PHOTO_FOUND",
      query: "cars",
      photo: newPhoto,
    });
    expect(result.currentPhoto).toEqual(newPhoto);
    expect(result.seenPhotoIds).toEqual([photo.id, newPhoto.id]);
  });
});
