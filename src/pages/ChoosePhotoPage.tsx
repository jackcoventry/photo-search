import { useAppContext } from "../app/Context";

export function ChoosePhotoPage() {
  const { state } = useAppContext();

  return <h1>Choose your photo, {state?.userDetails?.firstName} !</h1>;
}
