// src/components/Navigation.tsx
"use client";
import React, { useMemo, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ChatIcon from "@mui/icons-material/Chat";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import useAuthGuard from "@/hooks/auth/useAuthGuard";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import Image from "next/image";
import { useGhostGuard } from "@/hooks/auth/useGhostGuard";
import { useGetAllConversations } from "@/hooks/messages/useGetAllConversations";
import { extractConversationIdIntoArray } from "@/utils/extractConversationIdIntoArray";
import { useCheckIfAnyUnreadConversation } from "@/hooks/messages/useCheckIfAnyUnreadConversation";

const Navigation: React.FC = () => {
  const ghostGuard = useGhostGuard();
  const { user, loading } = useAuthGuard();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width:640px)");
  const { conversations } = useGetAllConversations(user?.uid);
  const conversationIds = useMemo(
    () => extractConversationIdIntoArray(conversations),
    [conversations]
  );
  const { conversationsUnread, loading: unreadConversationsLoading } =
    useCheckIfAnyUnreadConversation(conversationIds);

  if (loading || ghostGuard.loading || unreadConversationsLoading) {
    return (
      <div className="h-[60px] flex justify-center items-center text-[#1976D2] font-bold text-lg">
        Loading...
      </div>
    );
  }
  const currentUser = user || ghostGuard.user;
  const isAnonymous = currentUser?.isAnonymous ?? true;

  const handleNav = (path: string) => {
    setDrawerOpen(false);
    router.push(path);
  };

  const menuOptions = isAnonymous
    ? [
        { label: "Home", path: "/" },
        { label: "Sign In", path: "/sign-in" },
        { label: "Sign Up", path: "/sign-up" },
      ]
    : [
        { label: "Home", path: "/" },
        { label: "Gallery", path: "/gallery" },
        { label: "Albums", path: "/albums" },
        { label: "Feed", path: "/feed" },
        { label: "Users", path: "/users" },
        { label: "Upload", path: "/upload" },
        { label: "Profile", path: "/profile" },
      ];

  return (
    <>
      <AppBar position="fixed" sx={{ background: "white" }}>
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
                  <MenuIcon sx={{ fontSize: "2rem" }} />
                </IconButton>
                <div
                  className="relative h-[60px] w-[60px]"
                  onClick={() => router.push("/")}
                >
                  <Image
                    src="/picshare.png"
                    alt="PicShare logo 1"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <Button onClick={() => router.push("/messages")}>
                  <ChatIcon sx={{ fontSize: "2rem", color: "#1976D2" }} />
                  {conversationsUnread && conversationsUnread.length > 0 && (
                    <span className="absolute top-0 right-0 flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full animate-bounce">
                      {conversationsUnread.length}
                    </span>
                  )}
                </Button>
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
              <div
                className="relative h-[60px] w-[60px] cursor-pointer"
                onClick={() => router.push("/")}
              >
                <Image
                  src="/picshare.png"
                  alt="PicShare logo 1"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              {menuOptions.map((option, idx) => (
                <Button
                  key={idx}
                  color="inherit"
                  onClick={() => handleNav(option.path!)}
                  sx={{ textTransform: "none", color: "#1976D2" }}
                >
                  {option.label}
                </Button>
              ))}
              <Button onClick={() => router.push("/messages")}>
                <ChatIcon sx={{ fontSize: "2rem", color: "#1976D2" }} />
                {conversationsUnread && conversationsUnread.length > 0 && (
                  <span className="absolute top-0 right-0 flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full animate-bounce">
                    {conversationsUnread.length}
                  </span>
                )}
              </Button>
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
          {menuOptions.map((option, idx) => (
            <ListItem
              component="button"
              key={idx}
              onClick={() => handleNav(option.path!)}
            >
              <ListItemText primary={option.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Navigation;
