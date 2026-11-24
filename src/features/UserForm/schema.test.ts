import { describe, expect, it } from "vitest";
import { schema } from "./schema";

const validDetails = { firstName: "James", lastName: "Bond", topic: "travel" };

describe("User Details validation", () => {
  it("will reject any missing and empty / whitespace-only names", () => {
    for (const field of ["firstName", "lastName"]) {
      for (const value of [undefined, "", "   "]) {
        const result = schema.safeParse({ ...validDetails, [field]: value });
        expect(result.success).toBe(false);

        if (!result.success) {
          expect(
            result.error.issues.some((issue) => issue.path[0] === field),
          ).toBe(true);
        }
      }
    }
  });

  it("will trim names and custom topic text of any whitespace", () => {
    expect(
      schema.parse({
        firstName: " James ",
        lastName: " Bond ",
        topic: "other",
        other: " Mountains ",
      }),
    ).toEqual({
      firstName: "James",
      lastName: "Bond",
      topic: "other",
      other: "Mountains",
    });
  });

  it("requires a valid topic", () => {
    for (const topic of [undefined, "", "unknown"]) {
      expect(schema.safeParse({ ...validDetails, topic }).success).toBe(false);
    }
  });

  it("requires custom text only when other is selected from dropdown", () => {
    expect(schema.safeParse(validDetails).success).toBe(true);

    for (const other of [undefined, "", "   "]) {
      const result = schema.safeParse({
        ...validDetails,
        topic: "other",
        other,
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(
          result.error.issues.some((issue) => issue.path[0] === "other"),
        ).toBe(true);
      }
    }
  });

  it("will accept 50 characters after trimming whitespace but rejects 51 and over", () => {
    expect(
      schema.safeParse({
        ...validDetails,
        topic: "other",
        other: ` ${"a".repeat(50)} `,
      }).success,
    ).toBe(true);

    expect(
      schema.safeParse({
        ...validDetails,
        topic: "other",
        other: "a".repeat(51),
      }).success,
    ).toBe(false);
  });
});
