"use client";

import React from "react";
import useGetVerifiedUsers from "@/hooks/useGetVerifiedUsers";
import SearchBar from "@/components/ui/SearchBar";
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
      <div className="flex flex-col justify-center items-center px-8">
        <h1 className="text-[#1976D2] font-bold text-2xl">Profile</h1>

        <div className="w-full flex items-center justify-center gap-4">
          <AlgoliaSearch />
        </div>
        <h1 className="w-full flex items-center justify-center text-lg">
          Check out our verified users
        </h1>
        <div className="w-full flex flex-wrap items-center justify-center gap-2 px-4 md:px-8 lg:px-12">
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
