import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebaseConfig";

const useAuthGuard = () => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    const isAnonymous = user?.isAnonymous;
    if (!loading && !user && isAnonymous) {
      router.push("/sign-in");
    }
  }, [user, loading, router]);
  return { user, loading };
};

export default useAuthGuard;
