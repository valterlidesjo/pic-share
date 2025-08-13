"use client";

import { auth } from "@/firebaseConfig";
import { onAuthStateChanged, signInAnonymously, User } from "firebase/auth";
import { useEffect, useState } from "react";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
export const useGhostGuard = (): AuthState => {
  const [ghostAuthState, setGhostAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setGhostAuthState({ user: currentUser, loading: false, error: null });
      } else {
        signInAnonymously(auth)
          .then((userCredential) => {
            setGhostAuthState({
              user: userCredential.user,
              loading: false,
              error: null,
            });
          })
          .catch((error) => {
            console.error("Fel vid anonym inloggning:", error);
            setGhostAuthState({
              user: null,
              loading: false,
              error: "Kunde inte logga in anonymt.",
            });
          });
      }
    });
    return () => unsubscribe();
  }, []);
  return ghostAuthState;
};
