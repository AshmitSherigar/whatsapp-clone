import React from "react";
import { useAuth } from "../hooks/useAuth";
import Chat from "./Chat";
import Home from "./Home";

const Root = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? <Chat /> : <Home />;
};

export default Root;
