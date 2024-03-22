import AuthProvider from "@/auth/AuthProvider";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Router>
      <AuthProvider>{children}</AuthProvider>
    </Router>
  );
};

export default Providers;
