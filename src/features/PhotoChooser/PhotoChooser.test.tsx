// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";

import App from "../../App";
import type { Photo } from "../../app/reducer";
import { searchPhotos } from "../../lib/unsplash";

vi.mock("../../lib/unsplash", () => ({ searchPhotos: vi.fn() }));

const searchMock = vi.mocked(searchPhotos);

const photoA: Photo = {
  id: "a",
  url: "https://example.com/a.jpg",
  thumbnailUrl: "https://example.com/a-thumb.jpg",
  alt: "Snowy mountain",
  author: "Photographer A",
  externalLink: "https://example.com/a",
};

const photoB: Photo = {
  ...photoA,
  id: "b",
  url: "https://example.com/b.jpg",
  alt: "Mountain lake",
};

beforeEach(() => searchMock.mockReset());
afterEach(cleanup);

async function startSearch() {
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );

  await user.type(screen.getByRole("textbox", { name: "First Name" }), "James");
  await user.type(screen.getByRole("textbox", { name: "Last Name" }), "Bond");
  await user.selectOptions(
    screen.getByRole("combobox", { name: "Preferred topic" }),
    "other",
  );
  await user.type(
    screen.getByRole("textbox", { name: "Your preferred topic" }),
    "Mountains",
  );
  await user.click(screen.getByRole("button", { name: "Submit" }));
  return user;
}

describe("photo search and rejection", () => {
  it("shows loading state then displays first photo for the custom topic", async () => {
    let resolvePhoto!: (photo: Photo) => void;

    searchMock.mockReturnValueOnce(
      new Promise((resolve) => {
        resolvePhoto = resolve;
      }),
    );

    await startSearch();

    expect(screen.getByRole("status").textContent).toContain("Finding a photo");
    expect(screen.queryByRole("button", { name: "Accept" })).toBeNull();

    await waitFor(() =>
      expect(searchMock).toHaveBeenCalledWith(
        "mountains",
        expect.any(AbortSignal),
      ),
    );

    await act(async () => {
      resolvePhoto(photoA);
    });

    expect(
      (await screen.findByRole("img", { name: photoA.alt })).getAttribute(
        "src",
      ),
    ).toBe(photoA.url);

    expect(screen.getByRole("button", { name: "Accept" })).toBeDefined();
  });

  it("skips duplicate after rejection and shows the next unseen photo", async () => {
    let resolveNext!: (photo: Photo) => void;

    searchMock
      .mockResolvedValueOnce(photoA)
      .mockResolvedValueOnce(photoA)
      .mockReturnValueOnce(
        new Promise((resolve) => {
          resolveNext = resolve;
        }),
      );

    const user = await startSearch();

    await screen.findByRole("img", { name: photoA.alt });
    await user.click(screen.getByRole("button", { name: "Reject" }));
    await waitFor(() => expect(searchMock).toHaveBeenCalledTimes(3));

    expect(screen.queryByRole("img", { name: photoA.alt })).toBeNull();

    await act(async () => {
      resolveNext(photoB);
    });

    expect(
      (await screen.findByRole("img", { name: photoB.alt })).getAttribute(
        "src",
      ),
    ).toBe(photoB.url);

    expect(searchMock).toHaveBeenCalledTimes(3);
  });

  it("stops after three duplicates and lets user retry", async () => {
    searchMock.mockResolvedValue(photoA);

    const user = await startSearch();

    await screen.findByRole("img", { name: photoA.alt });
    await user.click(screen.getByRole("button", { name: "Reject" }));

    const retry = await screen.findByRole("button", { name: "Try again" });

    expect(searchMock).toHaveBeenCalledTimes(4);
    expect(screen.getByRole("status").textContent).toContain(
      "haven't seen yet",
    );
    expect(screen.queryByRole("img")).toBeNull();

    searchMock.mockResolvedValueOnce(photoB);

    await user.click(retry);
    await screen.findByRole("img", { name: photoB.alt });

    expect(searchMock).toHaveBeenCalledTimes(5);
  });

  it.each([
    {
      state: "empty results",
      error: null,
      message: "No photos found",
      retry: false,
    },
    {
      state: "network error",
      error: new Error("failed"),
      message: "Unable to load",
      retry: true,
    },
    {
      state: "rate limit",
      error: new Error("rate-limit"),
      message: "Search limit reached",
      retry: true,
    },
  ])(
    "recovers from state and restores details when changing topic",
    async ({ error, message, retry }) => {
      if (error) {
        searchMock.mockRejectedValueOnce(error);
      } else {
        searchMock.mockResolvedValueOnce(null);
      }

      const user = await startSearch();

      await waitFor(() =>
        expect(screen.getByRole("status").textContent).toContain(message),
      );

      expect(searchMock).toHaveBeenCalledTimes(1);

      if (retry) {
        searchMock.mockResolvedValueOnce(photoB);

        await user.click(screen.getByRole("button", { name: "Try again" }));
        await screen.findByRole("img", { name: photoB.alt });

        expect(searchMock).toHaveBeenCalledTimes(2);
      }

      await user.click(screen.getByRole("link", { name: "Change topic" }));

      expect(
        (
          screen.getByRole("textbox", {
            name: "First Name",
          }) as HTMLInputElement
        ).value,
      ).toBe("James");

      expect(
        (screen.getByRole("textbox", { name: "Last Name" }) as HTMLInputElement)
          .value,
      ).toBe("Bond");

      expect(
        (
          screen.getByRole("combobox", {
            name: "Preferred topic",
          }) as HTMLSelectElement
        ).value,
      ).toBe("other");

      expect(
        (
          screen.getByRole("textbox", {
            name: "Your preferred topic",
          }) as HTMLInputElement
        ).value,
      ).toBe("Mountains");
    },
  );
});
