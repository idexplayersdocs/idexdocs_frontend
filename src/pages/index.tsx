import Athletes from "./secure/athletes"
import { useEffect } from 'react';
import { useRouter } from 'next/router';
export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Check new auth storage keys first, fall back to legacy "token" key
    const preference = localStorage.getItem("storage_preference");
    const token = preference === "session"
      ? sessionStorage.getItem("access_token")
      : localStorage.getItem("access_token") || sessionStorage.getItem("access_token") || localStorage.getItem("token");

    token ? router.push("/secure/athletes") : router.push("/public/login");    
  }, [router]);
  return null
  // return (
  //   <>
  //     <Athletes />
  //   </>
  // );
}
