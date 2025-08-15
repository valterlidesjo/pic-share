// src/components/Navigation.tsx
"use client";
import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import useAuthGuard from "@/hooks/useAuthGuard";
import { signOut } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import Image from "next/image";

const Navigation: React.FC = () => {
  const { user } = useAuthGuard();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width:640px)");

  const isAnonymous = user?.isAnonymous;

  const handleNav = (path: string) => {
    setDrawerOpen(false);
    router.push(path);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setDrawerOpen(false);
    router.push("/");
  };

  const menuOptions = isAnonymous
    ? [
        { label: "Home", path: "/" },
        { label: "Gallery", path: "/gallery" },
        { label: "Upload", path: "/upload" },
        { label: "Sign In", path: "/sign-in" },
        { label: "Sign Up", path: "/sign-up" },
      ]
    : [
        { label: "Home", path: "/" },
        { label: "Gallery", path: "/gallery" },
        { label: "Feed", path: "/feed" },
        { label: "Users", path: "/users" },
        { label: "Upload", path: "/upload" },
        { label: "Profile", path: "/profile" },
        { label: "Log Out", action: handleLogout },
      ];

  return (
    <>
      <AppBar position="static" sx={{ background: "white" }}>
        <Toolbar>
          {!isDesktop && (
            <>
              <Box
                sx={{
                  display: "flex",
                  flex: 1,
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={() => setDrawerOpen(true)}
                  sx={{ mr: 2, color: "#1976D2" }}
                >
                  <MenuIcon />
                </IconButton>
                <div className="relative h-[60px] w-[60px]">
                  <Image
                    src="/picshare.png"
                    alt="PicShare logo 1"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Box>
            </>
          )}

          {isDesktop && (
            <Box
              sx={{
                display: "flex",
                flex: 1,
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <div className="relative h-[60px] w-[60px]">
                <Image
                  src="/picshare.png"
                  alt="PicShare logo 1"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              {menuOptions.map((option, idx) =>
                option.action ? (
                  <Button
                    key={idx}
                    color="inherit"
                    onClick={option.action}
                    sx={{ textTransform: "none", color: "#1976D2" }}
                  >
                    {option.label}
                  </Button>
                ) : (
                  <Button
                    key={idx}
                    color="inherit"
                    onClick={() => handleNav(option.path!)}
                    sx={{ textTransform: "none", color: "#1976D2" }}
                  >
                    {option.label}
                  </Button>
                )
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <List sx={{ width: 220 }}>
          {menuOptions.map((option, idx) =>
            option.action ? (
              <ListItem component="button" key={idx} onClick={option.action}>
                <ListItemText primary={option.label} />
              </ListItem>
            ) : (
              <ListItem
                component="button"
                key={idx}
                onClick={() => handleNav(option.path!)}
              >
                <ListItemText primary={option.label} />
              </ListItem>
            )
          )}
        </List>
      </Drawer>
    </>
  );
};

export default Navigation;
