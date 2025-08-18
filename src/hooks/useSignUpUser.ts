import {
  EmailAuthProvider,
  linkWithCredential,
  sendEmailVerification,
} from "firebase/auth";
import { useState } from "react";
import { useGhostGuard } from "./useGhostGuard";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebaseConfig";

const saveUserToFirestore = async (
  email: string,
  userId: string
): Promise<boolean> => {
  try {
    await setDoc(doc(db, "users", userId), {
      email: email,
      userId: userId,
      createdAt: new Date(),
      emailVerified: false,
    });
    return true;
  } catch (error) {
    console.error("Error saving user to firestore:", error);
    return false;
  }
};

export const useSignUpUser = () => {
  const { user } = useGhostGuard();
  const [message, setMessage] = useState<string | null>(null);

  const signUpUser = async (email: string, password: string) => {
    if (!user || !db) {
      console.error("No ghost user to link account with");
      setMessage("No ghost user to link account with");
      return;
    }
    if (!user.isAnonymous) {
      setMessage("You are already signed in with a permanent account.");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(email, password);
      await linkWithCredential(user, credential);
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        setMessage(
          "Account created successfully! Please verify your email to continue. Remember to check your spam inbox."
        );
      } else {
        setMessage(
          "Account created successfully! Could not send verification email. Please sign in and ask for a retry."
        );
      }
      const firestoreSaveSuccess = await saveUserToFirestore(email, user.uid);
      if (!firestoreSaveSuccess) {
        setMessage("Account linked successfully! Could not save user data.");
      }
    } catch (error) {
      console.error("Error linking account:", error);
      setMessage("Failed to link account. Please try again.");
    }
  };

  return { signUpUser, message };
};
