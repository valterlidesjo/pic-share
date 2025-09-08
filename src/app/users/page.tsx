"use client";

import React from "react";
import useGetVerifiedUsers from "@/hooks/users/useGetVerifiedUsers";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import AlgoliaSearch from "@/components/AlgoliaSearch";

const Users = () => {
  const { users } = useGetVerifiedUsers();
  const router = useRouter();

  const handleUserClick = (userId: string) => {
    router.push(`/users/${userId}`);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center px-8 mt-[60px]">
        <h1 className="text-[#1976D2] font-bold text-2xl">Profile</h1>

        <div className="w-full flex items-center justify-center gap-4 sm:max-w-[512px]">
          <AlgoliaSearch />
        </div>
        <p className="w-full flex items-center justify-center text-2xl font-bold mt-8 mb-4">
          Check out our verified users
        </p>
        <div className="w-full flex flex-wrap items-center justify-start gap-2 sm:max-w-[512px]">
          {users &&
            users.map((user) => (
              <Button
                variant="outlined"
                key={user.userId}
                onClick={() => handleUserClick(user.userId)}
              >
                {user.email}
              </Button>
            ))}
        </div>
      </div>
    </>
  );
};

export default Users;
