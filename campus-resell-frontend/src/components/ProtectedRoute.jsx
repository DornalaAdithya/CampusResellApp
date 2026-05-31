import { Navigate } from "react-router";
import userAuthStore from "../stores/authStore";
import Loader from "./Loader";

function ProtectedRoute({ children }) {
  const isAuthenticated = userAuthStore((state) => state.isAuthenticated);

  const authChecked = userAuthStore((state) => state.authChecked);
  if (!authChecked) {
    return <Loader />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
}

export default ProtectedRoute;
