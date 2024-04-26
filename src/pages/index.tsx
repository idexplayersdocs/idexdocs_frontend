import Athletes from "./secure/athletes"
import { useEffect } from 'react';
import { useRouter } from 'next/router';
export default function Index() {
  const router = useRouter();

  useEffect(() => {
    router.push('/secure/athletes');
  }, [router]);
  return null
  // return (
  //   <>
  //     <Athletes />
  //   </>
  // );
}
