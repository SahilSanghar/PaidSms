import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectRoute = ({
  children,
  user,
  redirect = "/login",
  googleRedirect = null,
  isGoogleLogin,
}) => {
  if (user === undefined) return null; // Handle loading state, e.g., show a loader

  if (!user) return <Navigate to={redirect} />;

  // If user is logged in with Google and a googleRedirect is provided, redirect them
  if (isGoogleLogin && googleRedirect) {
    return <Navigate to={googleRedirect} />;
  }

  return children ? children : <Outlet />;
};

export default ProtectRoute;
