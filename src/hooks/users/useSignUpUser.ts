import {
  EmailAuthProvider,
  linkWithCredential,
  sendEmailVerification,
} from "firebase/auth";
import { useState } from "react";
import { useGhostGuard } from "../auth/useGhostGuard";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebaseConfig";

export interface FirebaseAuthError {
  code: string;
  message: string;
}

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

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setMessage(
        "Password is to weak, it has to be at least 8 characters long, contain one capital letter and one number."
      );
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
          "Account created successfully, you can now sign in! Verify your email to become a verified member. Remember to check your spam inbox."
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
      if ((error as FirebaseAuthError).code) {
        const firebaseError = error as FirebaseAuthError;
        console.error(
          "Firebase Error:",
          firebaseError.code,
          firebaseError.message
        );
        switch (firebaseError.code) {
          case "auth/email-already-in-use":
            setMessage(
              "This email is alreay in use. Please use another one or log in to your account. "
            );
            break;
          case "auth/invalid-email":
            setMessage("Invalid e-mail. Controll it and please try again.");
            break;
          case "auth/weak-password":
            setMessage(
              "Password is to weak, it has to be at least 8 characters long, contain one capital letter and one number."
            );
            break;
          default:
            setMessage(
              "Unexpected error. Failed to create account. Please try again."
            );
            break;
        }
      }
    }
  };

  return { signUpUser, message };
};
