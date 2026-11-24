import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";

import { schema, type UserDetails } from "./schema";
import { useAppContext } from "../../app/Context";

export function UserForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<UserDetails>({
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

  const { dispatch } = useAppContext();

  const onSubmit = async (data: UserDetails) => {
    dispatch({
      type: "SUBMIT_USER_DETAILS",
      payload: data,
    });

    await navigate("/choose");
  };

  return (
    <article className="flex flex-col gap-4">
      <h1 tabIndex={-1}>Enter your details and preferred topic</h1>
      <section className="bg-white shadow-md rounded-2xl p-4 gap-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-6 w-full"
        >
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600" htmlFor="firstName">
              First Name
            </label>
            <input
              className="border-2 border-gray-300 p-2 rounded-md"
              {...register("firstName")}
              id="firstName"
              required
              autoComplete="given-name"
              aria-invalid={Boolean(errors.firstName)}
              aria-describedby={
                errors.firstName ? "firstName-error" : undefined
              }
            />

            {errors.firstName && (
              <p
                id="firstName-error"
                role="alert"
                className="text-red-500 text-sm"
              >
                {errors.firstName?.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600" htmlFor="lastName">
              Last Name
            </label>
            <input
              className="border-2 border-gray-300 p-2 rounded-md"
              {...register("lastName")}
              id="lastName"
              required
              autoComplete="family-name"
              aria-invalid={Boolean(errors.lastName)}
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
            />

            {errors.lastName && (
              <p
                id="lastName-error"
                role="alert"
                className="text-red-500 text-sm"
              >
                {errors.lastName?.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600" htmlFor="topic">
              Preferred topic
            </label>
            <select
              id="topic"
              {...register("topic")}
              defaultValue=""
              required
              aria-invalid={Boolean(errors.topic)}
              aria-describedby={errors.topic ? "topic-error" : undefined}
              className="border-2 border-gray-300 p-2 rounded-md"
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

            {errors.topic && (
              <p id="topic-error" role="alert" className="text-red-500 text-sm">
                {errors.topic.message}
              </p>
            )}
          </div>

          {selectedTopic === "other" && (
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600" htmlFor="other">
                Your preferred topic
              </label>
              <input
                className="border-2 border-gray-300 p-2 rounded-md"
                {...register("other")}
                id="other"
                required
                aria-invalid={Boolean(errors.other)}
                aria-describedby={errors.other ? "other-error" : undefined}
              />

              {errors.other && (
                <p
                  id="other-error"
                  role="alert"
                  className="text-red-500 text-sm"
                >
                  {errors.other?.message}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <button
              type="submit"
              className="bg-black text-white p-4 rounded-md hover:bg-green-500 cursor-pointer"
            >
              Submit
            </button>
          </div>
        </form>
      </section>
    </article>
  );
}
