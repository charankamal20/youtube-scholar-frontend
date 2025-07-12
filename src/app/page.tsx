"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("http://localhost:8080/auth/user", {
        credentials: "include",
      });

      if (!res.ok) {
        return new Response("Unauthorized", { status: 401 });
      }

      const user = await res.json();
      console.log("User data:", user);
      if (!user) {
        console.error("No user data found");
        return;
      }

      setUser(user);
    }

    fetchUser().catch((error) => {
      console.error("Error fetching user data:", error);
    });
  }, []);

  const login = () => {
    window.location.href = "http://localhost:8080/auth/google/login";
  };

  const logout = () => {
    document.cookie = "token=; Max-Age=0; path=/;";
    setUser(null);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-newsreader)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <h1>Youtube Scholar</h1>

        <div className="text-center text-sm">
          {user ? (
            <>
              <p>👋 Welcome, {user.name}</p>
              <button
                onClick={logout}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={login}
              className="mt-4 px-4 py-2 bg-black text-white rounded"
            >
              Login with Google
            </button>
          )}
        </div>
      </main>
      <footer className="row-start-3">...</footer>
    </div>
  );
}
