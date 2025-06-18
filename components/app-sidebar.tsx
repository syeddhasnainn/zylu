"use client";
import {
  ChevronUp,
  MoreHorizontal,
  Trash2,
  User2,
  Share,
  Settings,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useAuthActions } from "@convex-dev/auth/react";
import { Input } from "@/components/ui/input";
import { CirclePlus } from "lucide-react";
import { useMutation } from "convex/react";
import { SettingsDialog } from "@/components/settings-dialog";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/convex/auth";

export function AppSidebar() {
  const { signOut } = useAuthActions();
  const router = useRouter();
  const user = useQuery({
    ...convexQuery(api.user.getUser, {}),
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const { data: chats } = useQuery({
    // If debouncedSearch is present, use searchChat with its title
    // Otherwise, use getAllChats
    ...convexQuery(
      debouncedSearch ? api.chats.searchChat : api.chats.getAllChats, // Use searchChat if debouncedSearch exists, otherwise getAllChats
      debouncedSearch ? { title: debouncedSearch } : {}, // Pass title if searching, else empty object
    ),
    queryKey: [
      "convexQuery",
      debouncedSearch ? api.chats.searchChat : api.chats.getAllChats,
      debouncedSearch ? { title: debouncedSearch } : {},
    ], // Dynamic query key based on search state
    placeholderData: (previousData) => previousData, // Keep previous data while new data loads
    // keepPreviousData: true, // Alternative to placeholderData for similar effect
  });

  // const chats = useQuery(api.chats.getAllChats, {});

  const { isMobile } = useSidebar();
  const deleteChat = useMutation(api.chats.deleteChat);

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="text-lg font-bold">Zylo</SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          <div className="space-y-2">
            <Button
              className="w-full flex items-center justify-start just gap-2 cursor-pointer"
              onClick={() => {
                router.push("/chat");
                router.refresh();
              }}
            >
              <CirclePlus />
              <span>New Chat</span>
            </Button>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your chats"
            />
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats?.map((item: any) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild className="p-0 h-auto">
                    <div className="flex items-center w-full">
                      <Link
                        href={`/chat/${item.id}`}
                        className="flex-1 text-left truncate p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-l-md transition-colors"
                      >
                        {item.title}
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-r-md rounded-l-none"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          side={isMobile ? "bottom" : "right"}
                          align={isMobile ? "end" : "start"}
                          className="min-w-56 rounded-lg"
                        >
                          <DropdownMenuItem className="cursor-pointer">
                            <Share className="mr-2 h-4 w-4" />
                            <span>Share chat</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-destructive focus:text-destructive"
                            onClick={async () => {
                              await deleteChat({ chatId: item._id });
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete chat</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {/* {isLoading && <Loader variant="circular" size="sm" />} */}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="cursor-pointer"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings />
              Settings
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="cursor-pointer text-destructive hover:text-destructive"
              onClick={() => signOut()}
            >
              <User2 />
              Sign out
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </Sidebar>
  );
}
