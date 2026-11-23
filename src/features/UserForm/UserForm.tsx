import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "First name is required.")
      .max(50, "Please enter less than 50 characters"),
    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required.")
      .max(50, "Please enter less than 50 characters"),
    topic: z.enum(["travel", "cars", "wildlife", "technology", "other"], {
      error: "Please select a topic",
    }),
    other: z
      .string()
      .trim()
      .max(50, "Please enter less than 50 characters")
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

type FormValues = z.infer<typeof schema>;

export function UserForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    shouldUnregister: true,
    defaultValues: {
      other: "",
    },
  });

  const selectedTopic = useWatch({
    control,
    name: "topic",
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <fieldset>
        <div>
          <label htmlFor="firstName">First Name</label>
          <input {...register("firstName")} />
          <p>{errors.firstName?.message}</p>
        </div>

        <div>
          <label htmlFor="lastName">Last Name</label>
          <input {...register("lastName")} />
          <p>{errors.lastName?.message}</p>
        </div>

        <div>
          <label htmlFor="topic">Preferred topic</label>
          <select id="topic" {...register("topic")} defaultValue="">
            <option value="" disabled>
              Select a topic
            </option>
            <option value="travel">Travel</option>
            <option value="cars">Cars</option>
            <option value="wildlife">Wildlife</option>
            <option value="technology">Technology</option>
            <option value="other">Other</option>
          </select>

          {errors.topic && (
            <p id="topic-error" role="alert">
              {errors.topic.message}
            </p>
          )}
        </div>

        {selectedTopic === "other" && (
          <div>
            <label htmlFor="other">Other</label>
            <input {...register("other")} />
            <p>{errors.other?.message}</p>
          </div>
        )}

        <div>
          <button type="submit">Submit</button>
        </div>
      </fieldset>
    </form>
  );
}
