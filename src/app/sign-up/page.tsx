"use client";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSignUpUser } from "@/hooks/useSignUpUser";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signUpUser, message } = useSignUpUser();

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUpUser(email, password);
    setEmail("");
    setPassword("");
  };

  return (
    <>
      <div className="flex items-start justify-center h-screen pt-12 bg-gray-100">
        <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center text-[#1976D2]">
            Sign Up
          </h2>
          {message && (
            <p className="text-blue-500 mb-4 text-center">{message}</p>
          )}
          <form
            onSubmit={handleSubmit}
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
                label="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                className="w-full"
                type="password"
              />
            </div>
            <Button
              variant="outlined"
              type="submit"
              sx={{
                color: "#E38724",
              }}
            >
              Sign Up
            </Button>
          </form>
          <p className="mt-4">
            Already have an account?{" "}
            <a
              onClick={() => router.push("/sign-in")}
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

export default SignUp;
