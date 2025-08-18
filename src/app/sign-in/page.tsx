"use client";
import React from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/firebaseConfig";
import { useRouter } from "next/navigation";
import { Button, TextField } from "@mui/material";
import { checkUserDoc } from "@/utils/checkUserDoc";
import { useGhostGuard } from "@/hooks/useGhostGuard";

const SignIn = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();
  useGhostGuard();

  const handleSignIn = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const result = await signInWithEmailAndPassword(email, password);
      if (result?.user.uid === undefined) {
        console.log("Tried to check user doc but user not found");
      } else {
        await checkUserDoc(email, result?.user.uid);
      }
      setEmail("");
      setPassword("");
      router.push("/gallery");
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };
  return (
    <>
      <div className="flex items-start justify-center h-screen pt-12 bg-gray-100">
        <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center text-[#1976D2]">
            Sign In
          </h2>
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
