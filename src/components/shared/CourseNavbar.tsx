"use client";
import { ArrowLeft, GraduationCapIcon, MountainIcon } from "lucide-react";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStore } from "@/lib/store";
import { headers } from "next/headers";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const CourseNavbar = () => {
  const { zenMode } = useStore();

  const pathname = usePathname();
  console.log(pathname);

  if (pathname === "/auth/login" || pathname === "/auth/register") {
    return null;
  }

  return (
    <header className="fixed z-20 top-0 left-0 backdrop-blur-lg bg-background/10 px-4 lg:px-6 w-full h-14 flex items-center">
      <div
        className={`absolute w-full h-full bg-background transition-all duration-500 ${
          zenMode ? "opacity-100 z-40" : "opacity-0 -z-20"
        }`}
      ></div>
      <Link
        href="/"
        className="flex items-center justify-center"
        prefetch={false}
      >
        <div className="flex h-6 items-center space-x-4 text-sm">
          <ArrowLeft className="size-4" />
          <GraduationCapIcon />
          <Separator orientation="vertical" />
          <Badge>
            <h1 className="text-sm">Study with Youtube Scholar</h1>
          </Badge>
        </div>
      </Link>
      <nav className="font-semibold text-slate-600 ml-auto flex items-center gap-4 sm:gap-6">
        <Link
          href="/course"
          className="text-sm hover:underline underline-offset-4"
          prefetch={false}
        >
          Courses
        </Link>
        <Link
          href="/course"
          className="text-sm hover:underline underline-offset-4"
          prefetch={false}
        >
          Dashboard
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src="https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Random" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Keyboard shortcuts</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>Email</DropdownMenuItem>
                    <DropdownMenuItem>Message</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>More...</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem>New Team</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>GitHub</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuItem disabled>API</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
};

export default CourseNavbar;
