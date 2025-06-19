"use client";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function SiteHeader() {
  const router = useRouter();
  router.prefetch("/chat");

  return (
    <header className="sticky top-0 z-50 flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
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
      </div>
    </header>
  );
}
