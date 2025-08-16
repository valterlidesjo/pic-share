import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebaseConfig";

const useAuthGuard = () => {
  const shouldUseAuth = typeof window !== "undefined" && auth;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, loading] = useAuthState(shouldUseAuth ? auth : (null as any));
  const router = useRouter();

  useEffect(() => {
    if (!shouldUseAuth) {
      return;
    }

    const isAnonymous = user?.isAnonymous;
    if (!loading && !user && isAnonymous) {
      router.push("/sign-in");
    }
  }, [user, loading, router]);
  return {
    user: shouldUseAuth ? user : null,
    loading: shouldUseAuth ? loading : false,
  };
};

export default useAuthGuard;
