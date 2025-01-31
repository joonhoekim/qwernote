// @/components/sidebar-profile/ProfileButton.tsx
"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOut, Settings, Layout, HelpCircle } from "lucide-react";

export function ProfileButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Show login button if not authenticated
  if (status === "unauthenticated") {
    return (
      <Button
        variant="ghost"
        className="w-full justify-start"
        onClick={() => signIn("google")}
      >
        Login
      </Button>
    );
  }

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <Button variant="ghost" className="w-full justify-start" disabled>
        Loading...
      </Button>
    );
  }

  const handle = session?.user?.email?.split("@")[0]; // Temporary handle from email

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={session?.user?.image ?? ""} />
            <AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
          </Avatar>
          <span className="truncate">{handle}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem onClick={() => router.push(`/@${handle}/settings`)}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/@${handle}/categories`)}
        >
          <Layout className="mr-2 h-4 w-4" />
          Categories
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/help`)}
        >
          <HelpCircle className="mr-2 h-4 w-4" />
          Help
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut({ redirect: false })}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
