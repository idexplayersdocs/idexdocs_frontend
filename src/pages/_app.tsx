import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import React from "react";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  React.useEffect(() => {
    const isPublicRoute = router.pathname.startsWith("/public/");
    const token = localStorage.getItem("token");

    if (!token && !isPublicRoute) {
      router.push("/public/login");
    }
  }, [router.pathname]);

  return <Component {...pageProps} />;
}
