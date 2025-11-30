import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/styles/theme";

import Navigation from "../components/Navigation";

// Axios Interceptor for global Authorization header
import "@/utils/axiosClient";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Pages where the navbar should NOT appear
  const hideNavOn = [
    "/auth/login",
    "/auth/register",
    "/onboarding"
  ];

  const showNavbar = !hideNavOn.includes(router.pathname);

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* Global Navigation Bar */}
        {showNavbar && <Navigation />}

        {/* Render actual page */}
        <Component {...pageProps} />
      </ThemeProvider>
    </AuthProvider>
  );
}
