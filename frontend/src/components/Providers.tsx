import AuthProvider from "@/auth/AuthProvider";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Toaster visibleToasts={1} richColors />
          {children}
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
};

export default Providers;
