import { z } from "zod";

export const TOPICS = [
  "travel",
  "cars",
  "wildlife",
  "technology",
  "other",
] as const;

export const schema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "First name is required.")
      .max(50, "Please enter 50 characters or fewer"),
    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required.")
      .max(50, "Please enter 50 characters or fewer"),
    topic: z.enum(TOPICS, {
      error: "Please select a topic",
    }),
    other: z
      .string()
      .trim()
      .max(50, "Please enter 50 characters or fewer")
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.topic !== "other") return;

    if (!data.other) {
      ctx.addIssue({
        code: "custom",
        path: ["other"],
        message: "Please enter your topic",
      });
    }
  });

export type UserDetails = z.infer<typeof schema>;
