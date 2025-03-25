import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Components/Login/Auth/useAuth";

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
