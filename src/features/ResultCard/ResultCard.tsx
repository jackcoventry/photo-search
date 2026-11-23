import { useAppContext } from "../../app/Context";

export function ResultCard() {
  const { state } = useAppContext();
  const photo = state.acceptedPhoto;
  const user = state.userDetails;

  return (
    <article className="flex flex-col gap-4 ">
      <h1>Hi, {user?.firstName}! Here is your chosen card!</h1>

      <section className="bg-white shadow-md rounded-2xl p-4 grid grid-cols-2 gap-6">
        {photo && (
          <figure className="flex flex-col gap-4">
            <img
              src={photo.thumbnailUrl}
              alt={photo.alt}
              className="max-w-28"
            />
            <figcaption>
              Photo by {photo.author}
              <a
                href={photo.externalLink}
                target="_blank"
                rel="noopener"
                className="text-gray-800 hover:text-green-500 block text-xs"
              >
                View on unsplash
              </a>
            </figcaption>
          </figure>
        )}
        <div className="grid grid-cols-1 content-start gap-2">
          <dt className="text-sm text-gray-600">First Name</dt>
          <dd className="">{user?.firstName}</dd>
          <dt className="text-sm  text-gray-600">Last Name</dt>
          <dd className="">{user?.lastName}</dd>
        </div>
      </section>
    </article>
  );
}
