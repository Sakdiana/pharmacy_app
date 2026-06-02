import { Navigate } from "react-router-dom";
import { isAdminLoggedIn } from "../utils/adminAuth";

export default function ProtectedAdminRoute({ children }) {
  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
