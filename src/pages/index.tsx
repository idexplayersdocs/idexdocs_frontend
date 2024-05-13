import Athletes from "./secure/athletes"
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import "@/styles/globals.css";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    token ? router.push("/secure/athletes") : router.push("/public/login");    
  }, [router]);
  return null
  // return (
  //   <>
  //     <Athletes />
  //   </>
  // );
}
