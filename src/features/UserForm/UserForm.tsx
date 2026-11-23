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
