import { Navigate } from "react-router-dom";

const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) return false;
    return Date.now() / 1000 < payload.exp;
  } catch (e) {
    return false;
  }
};

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");

  if (!token || !isTokenValid(token)) {
    try {
      sessionStorage.removeItem("token");
    } catch (e) {
      // ignore
    }
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;