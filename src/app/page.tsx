"use client";
import { useGhostGuard } from "@/hooks/useGhostGuard";
import Button from "@mui/material/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  useGhostGuard();

  return (
    <>
      <div className="flex flex-col justify-center items-center w-full">
        <div className="flex flex-col justify-center items-center pb-8 sm:max-w-[512px]">
          <h1 className="px-8 w-full text-center font-bold text-2xl">
            The new big social media plattform everybody is talking about!
          </h1>
          <div className="relative h-[120px] w-[120px]">
            <Image
              src="/picshare2.png"
              alt="PicShare logo 1"
              fill
              className="object-contain"
              priority
            />
          </div>
          <p className="text-2xl px-8 w-full py-8">
            Start browsing and sign up right away to rid all of your FOMO and
            see why all your friends are hyping{" "}
            <span className="text-[#1976D2] font-bold">PicShare</span>
          </p>
          <Button
            variant="outlined"
            onClick={() => router.push("/sign-up")}
            sx={{
              width: "50%",
              height: "60px",
              fontSize: "1.5rem",
              color: "#E38724",
            }}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </>
  );
}
