"use client";
import useAuthGuard from "@/hooks/auth/useAuthGuard";
import { useGhostGuard } from "@/hooks/auth/useGhostGuard";
import { useIsMobile } from "@/hooks/useIsMobile";
import Button from "@mui/material/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  useGhostGuard();
  const { user } = useAuthGuard();
  const isMobile = useIsMobile(640);

  useEffect(() => {
    if (user && !user.isAnonymous) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [user]);

  return (
    <>
      <div className="flex flex-col justify-center items-center w-full">
        {isMobile ? (
          <>
            <div className="relative h-dvh w-full">
              <Image
                src="/picshare-collage.png"
                alt="PicShare collage"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>
          </>
        ) : (
          <>
            <div className="relative h-dvh w-full">
              <Image
                src="/picshare-collage-desk.png"
                alt="PicShare collage"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>
          </>
        )}

        <div className="flex flex-col justify-center items-center sm:flex-row sm:items-start">
          {/* {!isMobile && (
            <div className="absolute h-[520px] w-full top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Image
                src="/picsharelogo.png"
                alt="PicShare logo 1"
                fill
                className="object-contain"
                priority
              />
            </div>
          )} */}

          <div className="absolute py-6 w-full top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 sm:top-[50%]">
            <p className="px-4 pt-8 w-full text-center font-bold text-white text-6xl sm:text-left sm:w-[40%] sm:pt-0 sm:pl-32">
              Welcome to PicShare
            </p>
          </div>

          {isLoggedIn ? (
            <>
              <div className="absolute flex flex-col justify-center items-center py-6 w-full top-[70%] left-1/2 -translate-x-1/2 -translate-y-1/2 sm:top-[50%] sm:pr-32 sm:items-end">
                <Button
                  variant="contained"
                  onClick={() => router.push("/profile")}
                  sx={{
                    width: {
                      xs: "55%",
                      sm: "30%",
                    },
                    height: "60px",
                    fontSize: "1.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  Profile
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="absolute flex flex-col justify-center items-center py-6 w-full top-[70%] left-1/2 -translate-x-1/2 -translate-y-1/2 sm:top-[50%] sm:pr-32 sm:items-end">
                <Button
                  variant="contained"
                  onClick={() => router.push("/sign-up")}
                  sx={{
                    width: {
                      xs: "55%",
                      sm: "30%",
                    },
                    height: "60px",
                    fontSize: "1.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  Sign Up
                </Button>
                <Button
                  variant="contained"
                  onClick={() => router.push("/sign-in")}
                  sx={{
                    width: {
                      xs: "55%",
                      sm: "30%",
                    },
                    height: "60px",
                    fontSize: "1.5rem",
                  }}
                >
                  Sign In
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
