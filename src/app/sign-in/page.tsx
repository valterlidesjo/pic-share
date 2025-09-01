"use client";
import { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/firebaseConfig";
import { useRouter } from "next/navigation";
import { Button, TextField } from "@mui/material";
import { checkUserDoc } from "@/utils/checkUserDoc";
import { useGhostGuard } from "@/hooks/auth/useGhostGuard";
import { FirebaseAuthError } from "@/hooks/users/useSignUpUser";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();
  useGhostGuard();

  const handleSignIn = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const result = await signInWithEmailAndPassword(email, password);
      if (result?.user.uid === undefined) {
        setMessage("Login failed, could not find user.");
      } else {
        await checkUserDoc(email, result?.user.uid);
      }
      setEmail("");
      setPassword("");
      router.push("/gallery");
    } catch (error) {
      if ((error as FirebaseAuthError).code) {
        const firebaseError = error as FirebaseAuthError;
        console.error(
          "Firebase Error:",
          firebaseError.code,
          firebaseError.message
        );

        switch (firebaseError.code) {
          case "auth/invalid-email":
            setMessage("Invalid email. Please check the format.");
            break;
          case "auth/user-not-found":
            setMessage("No user found, please check your email and password.");
            break;
          case "auth/wrong-password":
            setMessage("No user found, please check your email and password.");
            break;
          case "auth/invalid-credential":
            setMessage("No user found, please check your email and password.");
            break;
          case "auth/user-disabled":
            setMessage("This account has been disabled.");
            break;
          default:
            setMessage("Unexpected error, please try again.");
            break;
        }
      }
    }
  };
  return (
    <>
      <div className="flex items-start justify-center h-screen pt-12 bg-gray-100 mt-[60px]">
        <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center text-[#1976D2]">
            Sign In
          </h2>
          {message && (
            <p className="text-blue-500 mb-4 text-center">{message}</p>
          )}
          <form
            onSubmit={(e) => handleSignIn(e)}
            className="flex flex-col justify-center items-center"
          >
            <div className="mb-4">
              <TextField
                id="email"
                label="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                className="w-full"
              />
            </div>
            <div className="mb-4">
              <TextField
                id="password"
                label="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                type="password"
                className="w-full"
                autoComplete="new-password"
              />
            </div>
            <Button
              variant="outlined"
              type="submit"
              sx={{
                color: "#E38724",
              }}
            >
              Sign In
            </Button>
          </form>
          <p className="mt-4">
            Don&apos;t have an account?{" "}
            <a
              onClick={() => router.push("/sign-up")}
              className="font-bold cursor-pointer"
            >
              Click here
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignIn;
