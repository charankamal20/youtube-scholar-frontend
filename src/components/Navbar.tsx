"use client";

import { useStore } from "@/lib/store";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import UserAvatar from "./UserAvatar";
import { useEffect, useState } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const { isLoggedIn } = useStore();
  const [path, setpath] = useState({
    pathname: "/auth/login",
    text: "Login",
  });

  useEffect(() => {
    if(isLoggedIn) {
      setpath({
        pathname: "/dashboard",
        text: "Dashboard",
      });
    }
    else {
      setpath({
        pathname: "/auth/login",
        text: "Login",
      });
    }

  }, [isLoggedIn])

  if (
    pathname === "/auth/login" ||
    pathname === "/auth/register" ||
    pathname === "/dashboard"
  ) {
    return null;
  }


  return (
    <header className="fixed z-20 top-0 left-0 backdrop-blur-lg bg-background/10 px-4 lg:px-6 w-full h-14 flex items-center">
      <Link
        href="/"
        className="flex items-center justify-center"
        prefetch={false}
      >
        <GraduationCap />
        <span className="sr-only">Youtube Scholar</span>
      </Link>
      <nav className="ml-auto items-center flex gap-4 sm:gap-6">
        <Link
          href="/course"
          className="text-sm font-medium hover:underline underline-offset-4"
          prefetch={false}
        >
          Courses
        </Link>

        <Link
          href="#"
          className="text-sm font-medium hover:underline underline-offset-4"
          prefetch={false}
        >
          About
        </Link>

        <Link
          href="#"
          className="text-sm font-medium hover:underline underline-offset-4"
          prefetch={false}
        >
          Contact
        </Link>

        <Link
          href={path.pathname}
          className="text-sm font-medium hover:underline underline-offset-4"
          prefetch={false}
        >
          {path.text}
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
