import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";

const useAuthGuard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined" || !auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      const isAnonymous = currentUser?.isAnonymous;
      if (!currentUser && isAnonymous) {
        router.push("/sign-in");
      }
    });
    return () => unsubscribe();
  }, [router]);
  return { user, loading };
};

export default useAuthGuard;
