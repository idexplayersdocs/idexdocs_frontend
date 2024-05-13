import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/css/style.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import React from "react";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  React.useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/public/login");
    }
  }, [router.pathname]);

  return <Component {...pageProps} />;
}
