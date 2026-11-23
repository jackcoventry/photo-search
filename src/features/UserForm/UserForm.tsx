import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  firstName: z.string().trim().min(1, "First name is required."),
  lastName: z.string().trim().min(1, "Last name is required."),
  preferredTopic: z.enum(
    ["Travel", "Cars", "Wildlife", "Technology", "Other"],
    { error: "Please select a topic" },
  ),
  other: z.string().trim().optional(),
});

type FormValues = z.infer<typeof schema>;

export function UserForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    shouldUnregister: true,
    defaultValues: {
      other: "",
    },
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
          <label htmlFor="preferredTopic">Preferred topic</label>
          <select
            id="preferredTopic"
            {...register("preferredTopic")}
            defaultValue=""
          >
            <option value="" disabled>
              Select a topic
            </option>
            <option value="travel">Travel</option>
            <option value="cars">Cars</option>
            <option value="wildlife">Wildlife</option>
            <option value="technology">Technology</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="other">Other</label>
          <input {...register("other")} />
          <p>{errors.other?.message}</p>
        </div>

        <div>
          <button type="submit">Submit</button>
        </div>
      </fieldset>
    </form>
  );
}
