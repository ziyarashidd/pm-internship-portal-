import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

function Logout() {
  useEffect(() => {
    localStorage.removeItem("isLoggedIn");
  }, []);

  return <Navigate to="/login" />;
}

export default Logout;
