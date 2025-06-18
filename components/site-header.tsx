"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function SiteHeader() {
  const router = useRouter();
  const { isAuthenticated } = useConvexAuth();
  console.log("isAuthenticated", isAuthenticated);
  const { signOut } = useAuthActions();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Button
          variant="ghost"
          size="sm"
          className="text-white cursor-pointer hover:bg-accent"
          onClick={() => {
            router.push("/chat");
            router.refresh();
          }}
        >
          <PlusIcon />
        </Button>
        {/* <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        /> */}
        <div className="ml-auto flex items-center gap-2">
          {isAuthenticated && (
            <Button
              onClick={() => {
                void signOut().then(() => {
                  router.push("/signin");
                  router.refresh();
                });
              }}
              variant="ghost"
              size="sm"
              className="text-white cursor-pointer bg-accent"
            >
              Sign out
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
