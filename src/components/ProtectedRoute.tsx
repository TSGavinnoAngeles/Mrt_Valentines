import { Navigate } from "react-router-dom";
import { useAuth } from "../screens/context/AuthContext";

export const ProtectedRoute = ({ children }: {children: any}) => {
  const { user } = useAuth();
//   console.log("local storage", user, user.email)
  if (!user || !user.email) {
    // user is not authenticated
    return <Navigate to="/" />;
  }
    return children;

};