import { Navigate } from "react-router";

import { useAppContext } from "../app/Context";
import { ResultCard } from "../features/ResultCard/ResultCard";

export function ResultPage() {
  const { state } = useAppContext();

  if (!state.userDetails) {
    return <Navigate to="/" replace />;
  }

  if (!state.acceptedPhoto) {
    return <Navigate to="/choose" replace />;
  }

  return <ResultCard />;
}
