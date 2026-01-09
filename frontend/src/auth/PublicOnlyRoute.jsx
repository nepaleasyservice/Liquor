import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function PublicOnlyRoute({ children, allowVerified = false }) {
  const { isLoggedIn, authLoading } = useContext(UserContext);
  const location = useLocation();

  if (authLoading) return null;

  if (allowVerified) {
    const params = new URLSearchParams(location.search);
    const verified = params.get("verified");
    if (verified === "true" || verified === "false") {
      return children;
    }
  }

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}
