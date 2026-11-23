import { useAppContext } from "../../app/Context";

export function ResultCard() {
  const { state } = useAppContext();
  const photo = state.acceptedPhoto;
  const user = state.userDetails;

  return (
    <div>
      <h1>Hi, {user?.firstName}! Here is your chosen card!</h1>
      <dd>
        <dt>First Name</dt>
        <dt>{user?.firstName}</dt>
        <dt>Last Name</dt>
        <dt>{user?.lastName}</dt>
      </dd>

      {photo && (
        <>
          <img src={photo.thumbnailUrl} alt={photo.alt} />
          <p>Photo by {photo.author}</p>
          <a href={photo.externalLink} target="_blank" rel="noopener">
            View on unsplash
          </a>
        </>
      )}
    </div>
  );
}
